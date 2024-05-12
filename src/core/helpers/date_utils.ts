function getLocaleFormatted ( dateTime, format = '' ) {
    // Create a Date object from the input dateTime string
      // Handle different formatting options
    let formattedDate = '';
    if(dateTime != null && dateTime != '' && dateTime != undefined){
      const date = new Date(dateTime);
      switch (format) {
        case 'full':
          formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(date);
          break;
    
        case 'short':
          formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }).format(date);
          break;
    
        case 'time':
          formattedDate = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(date);
          break;
    
        default:
          // Default case uses a more general date-time format
          formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(date);
          break;
      }
    }
    
  
    return formattedDate;
  };

  export  {getLocaleFormatted};