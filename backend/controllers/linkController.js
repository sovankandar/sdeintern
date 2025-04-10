const Link = require('../models/Link');
const Analytics = require('../models/Analytics');
const QRCode = require('qrcode');
const crypto = require('crypto');
const UAParser = require('ua-parser-js');

exports.createShortLink = async (req, res) => {
  try {
    const { originalUrl, alias, expirationDate } = req.body;
    const shortUrl = alias || crypto.randomBytes(4).toString('hex');
    
    const qrCode = await QRCode.toDataURL(`${process.env.BASE_URL}/${shortUrl}`);
    
    const link = await Link.create({
      userId: req.user._id,
      originalUrl,
      shortUrl,
      alias,
      expirationDate,
      qrCode
    });

    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user._id });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.redirectToOriginal = async (req, res) => {
  try {
    const link = await Link.findOne({ shortUrl: req.params.shortUrl });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.expirationDate && new Date() > link.expirationDate) {
      return res.status(410).json({ message: 'Link has expired' });
    }

    link.clicks += 1;
    await link.save();

    // Log analytics asynchronously
    const analytics = new Analytics({
      linkId: link._id,
      ipAddress: req.ip,
      deviceType: req.headers['user-agent'],
      browser: req.headers['user-agent']
    });
    analytics.save();

    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackClick = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const parser = new UAParser(req.headers['user-agent']);
    const userAgent = parser.getResult();
    
    const link = await Link.findOne({ shortUrl });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    link.clicks += 1;
    await link.save();

    await Analytics.create({
      linkId: link._id,
      ipAddress: req.ip,
      deviceInfo: {
        browser: `${userAgent.browser.name} ${userAgent.browser.version}`,
        os: `${userAgent.os.name} ${userAgent.os.version}`,
        device: userAgent.device.type || 'desktop',
        userAgent: req.headers['user-agent']
      },
      urlClicked: link.originalUrl
    });

    res.json({ 
      success: true, 
      clicks: link.clicks,
      deviceInfo: userAgent
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ message: 'Error tracking click' });
  }
};

exports.getLinkAnalytics = async (req, res) => {
  try {
    const { linkId } = req.params;
    
    const analytics = await Analytics.find({ linkId })
      .sort({ timestamp: -1 })
      .populate('linkId', 'shortUrl originalUrl');

    const deviceStats = await Analytics.aggregate([
      { $match: { linkId: mongoose.Types.ObjectId(linkId) } },
      { 
        $group: {
          _id: '$deviceInfo.device',
          count: { $sum: 1 },
          browsers: { $addToSet: '$deviceInfo.browser' },
          operatingSystems: { $addToSet: '$deviceInfo.os' }
        }
      }
    ]);

    const clicksByTime = await Analytics.aggregate([
      { $match: { linkId: mongoose.Types.ObjectId(linkId) } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          devices: { $addToSet: '$deviceInfo.device' },
          urls: { $addToSet: '$urlClicked' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      analytics,
      deviceStats,
      clicksByTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.redirectToOriginal = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const link = await Link.findOne({ shortUrl });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.expirationDate && new Date() > link.expirationDate) {
      return res.status(410).json({ message: 'Link has expired' });
    }

    // Increment click count
    link.clicks += 1;
    await link.save();

    // Log analytics
    await Analytics.create({
      linkId: link._id,
      ipAddress: req.ip,
      deviceType: req.headers['user-agent'],
      browser: req.headers['user-agent']
    });

    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};