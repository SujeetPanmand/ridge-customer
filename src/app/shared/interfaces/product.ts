export interface Rating {
  createdAt?: string;
  id?: string;
  productReviewFeedbackInfo?: [];
  rating?: number;
  review?: string;
  title?: string;
  userDetails?: UserBasics;
  likeCount?: number;
  disLikeCount?: number;
}
export interface UserBasics {
  fullName: string;
  id: string;
}
