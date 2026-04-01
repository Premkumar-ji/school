export interface SchoolInfo {
  _id?: string;
  logoUrl: string;
  heroImageUrl: string;
  name: string;
  slogan: string;
  motivationalLine: string;
  principalPhoto: string;
  principalBio: string;
  principalSlogan: string;
  address?: string;
  phone?: string;
  email?: string;
  footerDescription?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface TourPhoto {
  _id?: string;
  id?: string;
  title: string;
  photoUrl: string;
}

export interface TopPerformer {
  _id?: string;
  id?: string;
  class: string;
  rank: number;
  name: string;
  marks: string;
  bio: string;
  photoUrl: string;
}

export interface Teacher {
  _id?: string;
  id?: string;
  name: string;
  qualification: string;
  bio: string;
  photoUrl: string;
}

export interface Staff {
  _id?: string;
  id?: string;
  name: string;
  photoUrl: string;
}

export interface VisionQuote {
  _id?: string;
  id?: string;
  text: string;
}

export interface Award {
  _id?: string;
  id?: string;
  studentName: string;
  event: string;
  photoUrl: string;
}

export interface Announcement {
  _id?: string;
  id?: string;
  message: string;
  createdAt: string;
}

export interface Activity {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  date: string;
  photoUrl: string;
}

export interface YoutubeLink {
  _id?: string;
  id?: string;
  title: string;
  videoUrl: string;
}
