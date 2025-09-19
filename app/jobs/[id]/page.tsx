'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';

// --- Types ---
interface User {
  id: string;
  username: string;
  profileImageUrl?: string | null;
}
interface JobApplication {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  applicant: { id: string; username: string };
}
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}
interface JobPostDetails {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  status: 'OPEN' | 'CLOSED';
  author: User;
  category: { name: string };
  applications: JobApplication[];
  budget?: number | null;
  location?: string | null;
  duration?: string | null; // <-- Added duration property
}

// --- 1. เพิ่มฟังก์ชัน Validation ---
const containsPersonalInfo = (value: string): boolean | string => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(?:\+66|0)\d{1,2}-?\d{3,4}-?\d{4}/;
  const socialKeywordsRegex = /line|ไลน์|facebook|เฟซ|ig|ไอจี|tel|เบอร์/i;
  const urlRegex = /(https?:\/\/[^\s]+)/;

  if (emailRegex.test(value)) return "Please do not include emails.";
  if (phoneRegex.test(value)) return "Please do not include phone numbers.";
  if (socialKeywordsRegex.test(value)) return "Please do not share social media or contact info.";
  if (urlRegex.test(value)) return "Please do not include website links.";
  return true;
};


// --- CommentSection Component (โค้ดฉบับเต็ม) ---

function CommentSection({ jobPostId }: { jobPostId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{ content: string }>();
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/jobs/${jobPostId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  }, [jobPostId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  
  const onCommentSubmit: SubmitHandler<{ content: string }> = async (data) => {
    try {
      const res = await api.post(`/jobs/${jobPostId}/comments`, data);
      setComments(prevComments => [...prevComments, res.data]);
      reset();
    } catch (error) {
       if (axios.isAxiosError(error) && error.response) {
        // 2. ถ้าเป็น Status 401 (Unauthorized)
        if (error.response.status === 401) {
          // ไม่ต้อง console.error ที่นี่ เพราะเป็นพฤติกรรมที่คาดหวัง
          alert("Please log in to post a comment.");
        } else {
          // ถ้าเป็น Error อื่นๆ จาก Server (เช่น 400, 500) ให้ log และ alert
          console.error("API Error on posting comment:", error.response.data);
          alert(error.response.data.message || "Failed to post comment due to a server error.");
        }
      } else {
        // ถ้าเป็น Error ที่ไม่ใช่ Axios Error (เช่น ปัญหา network, ปัญหาในโค้ด)
        console.error("An unexpected error occurred while posting comment:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-xl font-bold mb-4">Discussion ({comments.length})</h3>
      <form onSubmit={handleSubmit(onCommentSubmit)} className="flex gap-2 mb-6">
        <input 
          {...register('content', { required: "Comment cannot be empty." ,validate: {
                  noPersonalInfo: (value) => containsPersonalInfo(value)
                }})} 
          placeholder="Write a comment..." 
          className="flex-grow p-2 border rounded-md" 
          disabled={isSubmitting}
        />
        <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
      {errors.content && <p className="text-red-500 text-sm mt-1 mb-4">{errors.content.message}</p>}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex items-start space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <Image src={comment.author.profileImageUrl ? `${API_BASE_URL}${comment.author.profileImageUrl}` : `https://placehold.co/40x40/EFEFEF/AAAAAA&text=${comment.author.username[0]}`} alt={comment.author.username} fill sizes="40px" style={{ objectFit: 'cover' }} unoptimized={true} />
            </div>
            <div className="bg-gray-100 p-3 rounded-md flex-1">
              <div className="flex items-center justify-between"><p className="font-semibold text-sm">{comment.author.username}</p><p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p></div>
              <p className="text-gray-800 mt-1 whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && !isSubmitting && (<p className="text-center text-gray-500">No comments yet. Be the first to start the discussion!</p>)}
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [job, setJob] = useState<JobPostDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

  const fetchJobDetails = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        setIsApplied(res.data.applications.some((app: JobApplication) => app.applicant.id === user.id));
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      router.push('/jobs');
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleApply = async () => {
    try {
      await api.post(`/jobs/${id}/apply`);
      alert("Successfully applied for the job!");
      fetchJobDetails();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "Failed to apply for the job.");
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to permanently delete this job post?")) {
      try {
        await api.delete(`/jobs/${id}`);
        alert("Job post deleted successfully.");
        router.push('/jobs');
      } catch (error) {
         console.error("Failed to delete job post:", error);
        alert("Failed to delete the job post.");
      }
    }
  };
  
  if (isLoading) return <p className="text-center p-10">Loading job details...</p>;
  if (!job) return null;

  const isOwner = currentUser?.id === job.author.id;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-grow">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{job.title}</h1>
            <p className="text-gray-500 mt-2">Posted by {job.author.username} in <span className="font-semibold">{job.category.name}</span></p>
          </div>

        

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            {isOwner && job.status === 'OPEN' && (
              <>
                <Link href={`/jobs/${job.id}/edit`} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 w-full text-center sm:w-auto">Edit Post</Link>
                <button onClick={handleDeletePost} className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600 w-full text-center sm:w-auto">Delete</button>
              </>
            )}
            {job.status === 'CLOSED' && (<div className="bg-gray-400 text-white font-bold px-3 py-1 rounded-md text-sm w-full text-center sm:w-auto">Job Closed</div>)}
          </div>
        </div>
        <div className="relative w-full h-96 mb-6 rounded-md overflow-hidden bg-gray-200">
          {job.imageUrl && (<Image src={`${API_BASE_URL}${job.imageUrl}`} alt={job.title} fill style={{ objectFit: 'cover' }} priority unoptimized={true} />)}
        </div>

        {/* --- ส่วนที่แก้ไข: แสดง Budget และ Location --- */}

         <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700 my-4 border-t border-b py-3 bg-gray-50 rounded-md px-4">
          
          {job.duration && (
                    <div>
                        <p className="text-sm font-bold text-gray-500">Duration</p>
                        <p className="text-lg">{job.duration}</p>
                    </div>
                )}
          
          
          {job.budget != null && ( // ใช้ != null เพื่อเช็คทั้ง null และ undefined
            <div className="flex items-center gap-2">
              <strong>Budget:</strong> {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(job.budget)}
            </div>
          )}
          {job.location && (
            <div className="flex items-center gap-2">
              <strong>Location:</strong> 
              <a 
                href={job.location.startsWith('http') ? job.location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all" // <-- เพิ่ม break-all
              >
                {job.location}
              </a>
            </div>
          )}
        </div>    


        <div className="prose max-w-none mb-6 whitespace-pre-wrap">{job.description}</div>
        {!isOwner && job.status === 'OPEN' && (<button onClick={handleApply} disabled={isApplied} className="bg-green-500 text-white px-6 py-3 rounded-md font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors">{isApplied ? "Have Applied สมัครแล้ว" : "Apply Job สมัครงาน"}</button>)}
        {isOwner && (
          <div className="mt-8 p-4 border rounded-md bg-gray-50">
            <h3 className="text-xl font-bold mb-4">Applicants ผู้สมัคร ({job.applications.length})</h3>
            {job.applications.length > 0 ? (
              <ul className="space-y-2">
                {job.applications.map(app => (
                  <li key={app.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                    <span className="font-semibold">{app.applicant.username}</span>
                    {/* {job.status === 'OPEN' && app.status === 'PENDING' && (<button onClick={() => handleAcceptApplication(app.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Hire This Person</button>)} */}
                    {app.status !== 'PENDING' && (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${ app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}>{app.status}</span>)}
                  </li>
                ))}
              </ul>
            ) : (<p>No one has applied yet.</p>)}
          </div>
          
        )}
        <CommentSection jobPostId={job.id} />

        
      </div>
    </div>
  );
}