$(document).ready(()=>{
  // Defining some useful constants that will be required shortly.
  const url = location.protocol.concat('//').concat(location.host);
  const css = {'visibility':'visible'};
  const delay = 800;

  // Using jquery to fadeIn body and attaching click listener to
  // home button inside callback.
  $('body').css(css).fadeOut(0).fadeIn(delay,()=>{
    $('div#home-container button').click(()=>{
      open(url.concat('/contents/html/home.html'),'_self');
    });
  });
});