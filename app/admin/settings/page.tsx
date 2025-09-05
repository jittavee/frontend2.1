// // client/app/admin/settings/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import api from '@/lib/api';
// import { useForm, Controller } from 'react-hook-form';

// interface SettingsForm {
//   allowJobPosting: boolean;
// }

// export default function AdminSettingsPage() {
//   const { control, handleSubmit, reset } = useForm<SettingsForm>({
//     defaultValues: { allowJobPosting: true }
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     api.get('/admin/settings').then(res => {
//       reset({
//         allowJobPosting: res.data.allowJobPosting === 'true'
//       });
//     }).finally(() => setIsLoading(false));
//   }, [reset]);

//   const onSubmit = async (data: SettingsForm) => {
//     try {
//       await api.put('/admin/settings', {
//         allowJobPosting: String(data.allowJobPosting) // ส่งเป็น string
//       });
//       alert('Settings updated successfully!');
//     } catch (error) {
//       alert('Failed to update settings.');
      
//     }
//   };

//   if (isLoading) return <p>Loading settings...</p>;

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-4">System Settings</h1>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="flex items-center justify-between p-4 border rounded-md">
//           <div>
//             <h3 className="font-semibold text-lg">Allow Job Posting</h3>
//             <p className="text-sm text-gray-500">Enable or disable the &quot;Post a Job&quot; button for all users.</p>
//           </div>
//           <Controller
//             name="allowJobPosting"
//             control={control}
//             render={({ field: { onChange, value } }) => (
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" checked={value} onChange={onChange} className="sr-only peer" />
//                 <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//               </label>
//             )}
//           />
//         </div>
//         <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Save Settings
//         </button>
//       </form>
//     </div>
//   );
// }

// client/app/admin/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useForm, Controller } from 'react-hook-form';

interface SettingsForm {
  allowJobPosting: boolean;
}

export default function AdminSettingsPage() {
  const { control, handleSubmit, reset } = useForm<SettingsForm>({
    defaultValues: { allowJobPosting: true }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      reset({
        allowJobPosting: res.data.allowJobPosting === 'true'
      });
    }).finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      await api.put('/admin/settings', {
        allowJobPosting: String(data.allowJobPosting)
      });
      alert('Settings updated successfully!');
    } catch (error) { // <-- บรรทัดที่ 32 โดยประมาณ
      // --- ส่วนที่แก้ไข (no-unused-vars) ---
      console.error("Failed to update settings:", error);
      alert('Failed to update settings.');
    }
  };

  if (isLoading) return <p>Loading settings...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div>
            <h3 className="font-semibold text-lg">Allow Job Posting</h3>
            {/* --- ส่วนที่แก้ไข (no-unescaped-entities) --- */}
            <p className="text-sm text-gray-500">Enable or disable the &quot;Post a Job&quot; button for all users.</p>
          </div>
          <Controller
            name="allowJobPosting"
            control={control}
            render={({ field: { onChange, value } }) => (
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={value} onChange={onChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            )}
          />
        </div>
        <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Settings
        </button>
      </form>
    </div>
  );
}