import { axiosInstance } from "./axios"

export const signup =async (signupData)=>{
    const response=await axiosInstance.post("/auth/signup",signupData);
    return response.data;
}

export const login =async (loginData)=>{
    const response=await axiosInstance.post("/auth/login",loginData);
    return response.data;
}

export const logout =async ()=>{
    const response=await axiosInstance.post("/auth/logout");
    return response.data;
}

export const getAuthUser =async()=>{
    try{
         const res=await axiosInstance.get("/auth/me");
      return res.data;

    }   catch(err){
        console.log("Error in getAuthUser api",err.message);
        return null;    

    } 

}

export const completeOnboarding = async(userData)=>{
    const response=await axiosInstance.post("/auth/onboarding",userData);
    return response.data;
}

export const getPosts = async()=> (await axiosInstance.get("/posts")).data.posts;
export const uploadMedia = async(file)=>{
    const formData=new FormData();
    formData.append("media",file);
    return (await axiosInstance.post("/posts/upload",formData)).data;
}
export const createPost = async(postData)=> (await axiosInstance.post("/posts",postData)).data.post;
export const toggleLike = async(postId)=> (await axiosInstance.post(`/posts/${postId}/like`)).data;
export const toggleSavePost = async(postId)=> (await axiosInstance.post(`/posts/${postId}/save`)).data;
export const getSavedPosts = async()=> (await axiosInstance.get("/posts/saved")).data.posts;
export const getPostComments = async(postId)=> (await axiosInstance.get(`/posts/${postId}/comments`)).data.comments;
export const createComment = async({postId,content})=> (await axiosInstance.post(`/posts/${postId}/comments`,{content})).data.comment;
export const updateProfile = async(profileData)=> (await axiosInstance.put("/users/profile",profileData)).data.user;

export const getUserFriends = async()=>{
    const response=await axiosInstance.get("/users/friends");
    return response.data;
}

export const getRecommendedUsers = async()=>{
    const response=await axiosInstance.get("/users");
    return response.data;
}

export const getOutgoindFriendReqs = async()=>{
    const response=await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}

export const sendFriendRequest = async(userId)=>{
    const response=await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export async function getFriendRequests(){
    const response=await axiosInstance.get("/users/friend-requests");
    return response.data;
}

export async function acceptFriendRequest(requestId){
    const response=await axiosInstance.post(`/users/friend-request/${requestId}/accept`)
    return response.data;
}

export async function getStreamToken(){
    const response=await axiosInstance.get("/chat/token");
    return response.data;
}