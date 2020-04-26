$(document).ready(()=>{
  // Defining some useful constants.
  const url = location.protocol.concat('//').concat(location.host);
  const css = {'visibility':'visible'};
  const delay = 800;

  // Using jquery to make body fadeIn and attach click listener
  // to div#home-container > button isside callback.
  $('body').css(css).fadeOut(0).fadeIn(delay,()=>{
    $('div#home-container button').click(()=>{
      open(url.concat('/contents/html/home.html'),'_self');
    });
  });

  // Defining chain of promises to handle subsequent tasks, 
  // starting with GET request to get mongo score docs.
  new Promise((resolve,reject)=>{
    $.getJSON(url.concat('/api/v1/scores.json'),
      json => resolve(json.data));
  })
  // Replacing value of country property of each doc with url 
  // pointing to png file of that country's flag.
  .then((docs)=>{
    const flag = `https://www.countryflags.io/CODE/flat/48.png`;
    docs.forEach((doc)=>{
      doc.country = flag.replace('CODE',doc.country);
    });
    return docs;
  })
  // Creating html and populating that html with docs data, the 
  // docs will then be housed inside div#scores-container.
  .then((docs)=>{
    docs.forEach((doc)=>{
      const html = $(
        `<div>
          <div class = "wrapper"><img src = ${doc.country}></div>
          <div class = "wrapper">${doc.name}</div>
          <div class = "wrapper">${doc.score}</div>
        </div>`);
        $('div#scores-container').append(html);
    });
  })
  // Displaying results now that all content has been loaded and
  // page has been embedded with said content.
  .then(()=>{
    const css = {'visibility':'visible'};
    $('div#message-container').fadeOut(delay*2,()=>{
      const container = $('div#page-container');
      container.css(css).fadeOut(0).fadeIn(delay);
    });
  });
});