// import React, { useEffect, useState } from "react";
// import api from "../Services/api";

// const Reviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const res = await api.get("/reviews");
//         setReviews(res.data.reviews || res.data);
//       } catch (error) {
//         console.error("Reviews error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, []);

//   if (loading) return <p className="p-6">Loading reviews...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-[#421713]">Reviews</h1>
//       <p className="text-gray-500 mb-6">Customer feedback and ratings</p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {reviews.map((review) => (
//           <div key={review._id} className="bg-white p-5 rounded-xl shadow">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-semibold">
//                 {review.user?.name || review.name || "Customer"}
//               </h3>

//               <span className="text-yellow-600">
//                 {"★".repeat(
//                   Math.min(5, Math.max(0, Number(review.rating) || 0)),
//                 )}
//               </span>
//             </div>

//             <p className="text-gray-600">
//               {review.comment || review.review || "No comment"}
//             </p>

//             <p className="text-xs text-gray-400 mt-3">
//               {review.product?.productName || "Product review"}
//             </p>
//           </div>
//         ))}

//         {reviews.length === 0 && (
//           <p className="text-gray-500">No reviews found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reviews;
