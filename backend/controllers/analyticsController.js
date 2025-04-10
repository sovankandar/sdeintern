const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');
const Link = require('../models/Link');

exports.getLinkAnalytics = async (req, res) => {
  try {
    const { linkId } = req.params;
    
    // Validate linkId format
    if (!mongoose.Types.ObjectId.isValid(linkId)) {
      return res.status(400).json({ message: 'Invalid link ID format' });
    }

    const objectId = new mongoose.Types.ObjectId(linkId);

    // Get basic analytics
    const analytics = await Analytics.find({ linkId: objectId });

    // Get device statistics
    const deviceStats = await Analytics.aggregate([
      { $match: { linkId: objectId } },
      { 
        $group: { 
          _id: '$deviceInfo.device', 
          count: { $sum: 1 } 
        }
      }
    ]);

    // Get browser statistics
    const browserStats = await Analytics.aggregate([
      { $match: { linkId: objectId } },
      { 
        $group: { 
          _id: '$deviceInfo.browser', 
          count: { $sum: 1 } 
        }
      }
    ]);

    // Get OS statistics
    const osStats = await Analytics.aggregate([
      { $match: { linkId: objectId } },
      { 
        $group: { 
          _id: '$deviceInfo.os', 
          count: { $sum: 1 } 
        }
      }
    ]);

    // Get time-based statistics (last 7 days)
    const timeStats = await Analytics.aggregate([
      { $match: { 
        linkId: objectId,
        timestamp: { 
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        }
      }},
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$timestamp" 
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      analytics,
      deviceStats,
      browserStats,
      osStats,
      timeStats
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: error.message });
  }
};