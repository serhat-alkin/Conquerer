const elasticService = require('../services/elasticService');

const categoryRates = async (req, res) => {
  try {
    const result = await global.client.search({
      index: 'search-posts',
      body: {
        aggs: {
          category_breakdown: {
            terms: {
              field: 'category.keyword'
            }
          }
        }
      }
    });

    if(result && result.aggregations && result.aggregations.category_breakdown){
      res.json(result.aggregations.category_breakdown.buckets);
    } else {
      throw new Error('Aggregations not found in response');
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching category rates' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const bloggerUsersResponse = await elasticService.getBloggerUsers(client);
    const bloggerUsers = bloggerUsersResponse?.aggregations?.bloggerCount?.value;
    const allUsersResponse = await elasticService.getUserStats(client);

    const totalUsers = allUsersResponse.count;
    const readerUsers = totalUsers - bloggerUsers;

    res.json({
      totalUsers,
      bloggerUsers,
      readerUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getPostsThisWeek = async (req, res) => {
  try {
    const weekRange = elasticService.getWeekRange();
    const response = await elasticService.fetchPosts(weekRange, 'day');
    const result = elasticService.processResponse(response);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getPostsThisMonth = async (req, res) => {
  try {
    const monthRange = elasticService.getMonthRange();
    const response = await elasticService.fetchPosts(monthRange, 'week');
    const result = elasticService.processResponseForMonth(response);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getPostsThisYear = async (req, res) => {
  try {
    const yearRange = elasticService.getYearRange();
    const response = await elasticService.fetchPosts(yearRange, 'month');
    const result = elasticService.processResponseForYear(response);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  categoryRates, 
  getUserStats, 
  getPostsThisWeek, 
  getPostsThisMonth, 
  getPostsThisYear 
};
