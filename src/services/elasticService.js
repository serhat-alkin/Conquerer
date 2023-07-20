const getUserStats = async (req, res) => {
  return await client.count({
    index: 'search-users',
  });
};

const getBloggerUsers = async (client) => {
  return await client.search({
    index: 'search-posts',
    body: {
      size: 0,
      aggs: {
        bloggerCount: {
          cardinality: {
            field: 'profile.username.keyword',
          },
        },
      },
    },
  });
}

const getWeekRange = () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7);
  
  return {
    gte: startOfWeek.toISOString(),
    lte: endOfWeek.toISOString(),
  };
};

const getMonthRange = () => {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return {
    gte: startOfMonth.toISOString(),
    lte: endOfMonth.toISOString(),
  };
};

const fetchPosts = async (range, interval = 'day') => {
  return await client.search({
    index: 'search-posts',
    body: {
      size: 0,
      _source: false,
      query: {
        range: {
          createdAt: range,
        },
      },
      aggs: {
        time_buckets: {
          date_histogram: {
            field: 'createdAt',
            calendar_interval: interval,
          },
          aggs: {
            categories: {
              terms: {
                field: 'category.keyword',
                size: 10,
              },
            },
          },
        },
      },
    },
  });
};

const processResponse = (response) => {
  if (!response || !response.aggregations || !response.aggregations.time_buckets) {
    console.error('Invalid response:', response);
    throw new Error('Invalid response from Elasticsearch');
  }

  const days = response.aggregations.time_buckets.buckets;
  const result = {};

  for (const day of days) {
    const dayOfWeek = new Date(day.key_as_string).toLocaleDateString('en-US', { weekday: 'long' });
    const categories = day.categories.buckets.reduce((acc, category) => {
      acc[category.key] = category.doc_count;
      return acc;
    }, {});
    result[dayOfWeek] = categories;
  }
  return result;
};


const processResponseForMonth = (response) => {
  const weeks = response.aggregations.time_buckets.buckets;
  const result = {};

  for (const week of weeks) {
    const weekOfYear = getWeekNumber(new Date(week.key_as_string));
    const categories = week.categories.buckets.reduce((acc, category) => {
      acc[category.key] = category.doc_count;
      return acc;
    }, {});
    result[`Week ${weekOfYear}`] = categories;
  }
  
  return result;
};

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  return weekNo;
}

const getYearRange = () => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

  return {
    gte: startOfYear.toISOString(),
    lte: endOfYear.toISOString(),
  };
};

const processResponseForYear = (response) => {
  const months = response.aggregations.time_buckets.buckets;
  const result = {};

  for (const month of months) {
    const monthOfYear = new Date(month.key_as_string).toLocaleString('en-US', { month: 'long' });
    const categories = month.categories.buckets.reduce((acc, category) => {
      acc[category.key] = category.doc_count;
      return acc;
    }, {});
    result[monthOfYear] = categories;
  }

  return result;
};

module.exports = {
  getBloggerUsers, 
  getMonthRange, 
  getUserStats, 
  processResponseForMonth, 
  getWeekRange, 
  processResponse, 
  fetchPosts, 
  getYearRange, 
  processResponseForYear 
};