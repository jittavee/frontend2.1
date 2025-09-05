'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form'; // <--- Import ที่ถูกต้อง
import api from '@/lib/api';
import { type Comment } from '@/types';

interface CommentSectionProps {
  jobPostId: string;
}

export default function CommentSection({ jobPostId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get<Comment[]>(`/jobs/${jobPostId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  }, [jobPostId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  
  const onCommentSubmit = async (data: { content: string }) => {
    try {
      const res = await api.post<Comment>(`/jobs/${jobPostId}/comments`, data);
      setComments(prev => [...prev, res.data]);
      reset();
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Please log in to comment.");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      <form onSubmit={handleSubmit(onCommentSubmit)} className="flex gap-2 mb-6">
        <input 
          {...register('content', { required: true })} 
          placeholder="Write a comment..." 
          className="flex-grow p-2 border rounded-md" 
        />
        <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-md">Post</button>
      </form>
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
            <p className="font-semibold">{comment.author.username}</p>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}