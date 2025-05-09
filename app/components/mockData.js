'use client';

// Sample travel destinations with images
const destinations = [
  { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop' },
  { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&auto=format&fit=crop' },
  { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop' },
  { name: 'New York City, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop' },
  { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop' },
  { name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop' },
  { name: 'Machu Picchu, Peru', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&auto=format&fit=crop' },
  { name: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop' },
  { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=600&auto=format&fit=crop' },
  { name: 'Cape Town, South Africa', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&auto=format&fit=crop' }
];

// Mock users
const users = [
  { id: '1', name: 'Test User', email: 'test@example.com', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { id: '4', name: 'Elena Rodriguez', email: 'elena@example.com', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' }
];

// Generate random sample posts
export function generatePosts(count = 10) {
  const posts = [];
  for(let i = 0; i < count; i++) {
    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    // Generate random dates within the last year
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - Math.floor(Math.random() * 365));
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 14) - 1);
    
    posts.push({
      id: `post-${i+1}`,
      title: `My ${Math.random() > 0.5 ? 'Amazing' : 'Unforgettable'} Trip to ${dest.name}`,
      description: `I had an incredible time exploring ${dest.name}. ${Math.random() > 0.5 ? 'The food was delicious and the people were friendly.' : 'The views were breathtaking and the experience was life-changing.'}`,
      dates: `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      destinations: dest.name,
      images: [dest.image],
      user: user,
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 10),
      createdAt: endDate.toISOString()
    });
  }
  
  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get user-specific posts
export function getUserPosts(userId, count = 5) {
  return generatePosts(count).map(post => ({
    ...post,
    user: users.find(u => u.id === userId) || users[0]
  }));
}

// Get all posts for the feed
export function getFeedPosts(count = 10) {
  return generatePosts(count);
} 