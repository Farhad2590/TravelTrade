import React, { useState, useEffect } from 'react';
import { Star, Calendar, Package, User, MessageSquare, Filter, TrendingUp, Trash2 } from 'lucide-react';
import axios from 'axios';

const AllReviews = () => {
    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterRating, setFilterRating] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllSenderReviews();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allReviews, filterRating, filterRole, sortBy, searchTerm]);

    const fetchAllSenderReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:9000/users/reviews/all-given-by-senders`);
            
            if (response.data) {
                setAllReviews(response.data.reviews || []);
            } else {
                setError('Failed to fetch reviews');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...allReviews];

        // Filter by rating
        if (filterRating !== 'all') {
            const rating = parseInt(filterRating);
            filtered = filtered.filter(review => review.rating === rating);
        }

        // Filter by role
        if (filterRole !== 'all') {
            if (filterRole === 'sender-reviews') {
                filtered = filtered.filter(review => review.reviewerRole === 'sender');
            } else if (filterRole === 'traveler-reviews') {
                filtered = filtered.filter(review => review.reviewerRole === 'traveler');
            } else if (filterRole === 'reviews-for-travelers') {
                filtered = filtered.filter(review => review.reviewedUserRole === 'traveler');
            } else if (filterRole === 'reviews-for-senders') {
                filtered = filtered.filter(review => review.reviewedUserRole === 'sender');
            }
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(review => 
                (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (review.reviewerName && review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (review.reviewedUserName && review.reviewedUserName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (review.parcel_type && review.parcel_type.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Sort reviews
        filtered.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'highest') {
                return b.rating - a.rating;
            } else if (sortBy === 'lowest') {
                return a.rating - b.rating;
            }
            return 0;
        });

        setFilteredReviews(filtered);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${
                    index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatistics = () => {
        const totalReviews = filteredReviews.length;
        const averageRating = totalReviews > 0 
            ? (filteredReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
            : 0;
        
        const senderReviews = filteredReviews.filter(r => r.reviewerRole === 'sender').length;
        const travelerReviews = filteredReviews.filter(r => r.reviewerRole === 'traveler').length;
        
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        filteredReviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });

        return {
            totalReviews,
            averageRating,
            senderReviews,
            travelerReviews,
            ratingDistribution
        };
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await axios.delete(`http://localhost:9000/users/reviews/${reviewId}`);
                // Refresh the reviews after deletion
                fetchAllSenderReviews();
            } catch (err) {
                setError('Failed to delete review');
                console.error('Error deleting review:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">Error: {error}</p>
                <button 
                    onClick={fetchAllSenderReviews}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const stats = getStatistics();

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-2">Review Management Dashboard</h1>
                <p className="text-blue-100">Monitor and manage all reviews given by senders</p>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Average Rating</p>
                            <p className="text-2xl font-bold text-green-600">{stats.averageRating}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Sender Reviews</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.senderReviews}</p>
                        </div>
                        <User className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Traveler Reviews</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.travelerReviews}</p>
                        </div>
                        <Package className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">5-Star Reviews</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.ratingDistribution[5]}</p>
                        </div>
                        <Star className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Rating Distribution Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => {
                        const count = stats.ratingDistribution[rating];
                        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                        return (
                            <div key={rating} className="flex items-center space-x-3">
                                <span className="text-sm font-medium w-8">{rating}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-12">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-48"
                    />
                    <select 
                        value={filterRating} 
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                    <select 
                        value={filterRole} 
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Reviews</option>
                        <option value="sender-reviews">Reviews by Senders</option>
                        <option value="traveler-reviews">Reviews by Travelers</option>
                        <option value="reviews-for-travelers">Reviews for Travelers</option>
                        <option value="reviews-for-senders">Reviews for Senders</option>
                    </select>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No reviews found matching your criteria.</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id || review._id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Review Header */}
                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className="flex items-center space-x-2">
                                            {review.reviewerPhoto && (
                                                <img 
                                                    src={review.reviewerPhoto} 
                                                    alt={review.reviewerName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {review.reviewerName || 'Anonymous'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {review.reviewerRole || 'Unknown Role'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">→</span>
                                            {review.reviewedUserPhoto && (
                                                <img 
                                                    src={review.reviewedUserPhoto} 
                                                    alt={review.reviewedUserName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {review.reviewedUserName || 'Anonymous'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {review.reviewedUserRole || 'Unknown Role'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating and Date */}
                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className="flex items-center space-x-1">
                                            {renderStars(review.rating)}
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(review.createdAt)}</span>
                                        </div>
                                        {review.parcel_type && (
                                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                <Package className="w-4 h-4" />
                                                <span>{review.parcel_type}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Review Comment */}
                                    <p className="text-gray-700 leading-relaxed">
                                        {review.comment || 'No comment provided'}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleDeleteReview(review.id || review._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete Review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination or Load More could go here */}
            {filteredReviews.length > 0 && (
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Showing {filteredReviews.length} of {allReviews.length} reviews
                    </p>
                </div>
            )}
        </div>
    );
};

export default AllReviews;