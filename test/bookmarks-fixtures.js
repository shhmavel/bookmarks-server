function makeBookmarksArray() {
    return [
      {
        id: 1,
        title: 'Thinkful',
        web: 'https://www.thinkful.com',
        descript: 'Think outside the classroom',
        rating: 5,
      },
      {
        id: 2,
        title: 'Google',
        web: 'https://www.google.com',
        descript: 'Where we find everything else',
        rating: 4,
      },
      {
        id: 3,
        title: 'MDN',
        web: 'https://developer.mozilla.org',
        descript: 'The only place to find web documentation',
        rating: 5,
      },
    ]
  }
  
  module.exports = {
    makeBookmarksArray,
  }