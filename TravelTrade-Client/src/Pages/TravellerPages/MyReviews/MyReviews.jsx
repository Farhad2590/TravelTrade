import React, { useState, useEffect } from 'react';
import { Star, Calendar, Package, User, MessageSquare, Filter } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';

const MyReviews = () => {
    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
      const { user } = useAuth();

    useEffect(() => {
        fetchAllSenderReviews();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allReviews, filterRating, sortBy]);

    const fetchAllSenderReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:9000/users/reviews/received/${user?.email}`);
            const data = await response.json();
            
            if (response.ok) {
                setAllReviews(data.reviews || []);
            } else {
                setError(data.error || 'Failed to fetch reviews');
            }
        } catch (err) {
            setError('Network error occurred');
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

    const getAverageRating = () => {
        if (filteredReviews.length === 0) return 0;
        const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / filteredReviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        filteredReviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
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
            </div>
        );
    }

    const ratingDistribution = getRatingDistribution();

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Reviews by Senders</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{filteredReviews.length}</div>
                        <div className="text-sm text-gray-600">Total Reviews</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{getAverageRating()}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{ratingDistribution[5]}</div>
                        <div className="text-sm text-gray-600">5-Star Reviews</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {new Set(filteredReviews.map(r => r.reviewerEmail)).size}
                        </div>
                        <div className="text-sm text-gray-600">Unique Senders</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No reviews found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((review, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            {review.senderPhoto ? (
                                                <img 
                                                    src={review.senderPhoto} 
                                                    alt={review.senderName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-6 h-6 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {review.senderName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{review.reviewerEmail}</p>
                                            <p className="text-xs text-blue-600">
                                                Reviewed: {review.reviewedUserName} ({review.reviewedUserRole})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(review.rating)}
                                        <span className="text-sm text-gray-600 ml-2">
                                            {review.rating}/5
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <Package className="w-4 h-4" />
                                            <span>{review.parcel_type}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;