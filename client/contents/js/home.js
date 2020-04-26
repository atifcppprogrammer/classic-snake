$(document).ready(()=>{
  // Defining some useful constants that will be required shortly.
  const url = location.protocol.concat('//').concat(location.host);
  const css = {'visibility':'visible'};
  const delay = 800;

  // Generating array of urls to be called by click listeners that
  // will be introducing shortly.
  let links = ['play','scores','credits'].map((page)=>{
    return url.concat(`/contents/html/${page}.html`);
  });

  // Using jquery to fadeIn body and attaching click listeners
  // to div#options-container buttons inside callback.
  $('body').css(css).fadeOut(0).fadeIn(delay,()=>{
     $('div#options-container button').each((index,button)=>{
       $(button).click(()=>{
         open(links[index],'_self');
       });
     });
  });
});