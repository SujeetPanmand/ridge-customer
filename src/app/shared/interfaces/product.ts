export interface Rating {
  createdAt: string;
  id: string;
  productReviewFeedbackInfo: [];
  rating: number;
  review: string;
  title: string;
  userDetails: User;
}
export interface User {
  fullName: string;
}
