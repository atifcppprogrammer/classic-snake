$(document).ready(() => {
  // Defining some useful constants that will be required shortly.
  const url = location.protocol.concat('//').concat(location.host);
  const token = 'bb6732e54ec4ed';
  const show = {'visibility':'visible'};
  const hide = {'visibility':'hidden'};
  const delay = 800;

  // Making GET requests to determine the client's country using
  // the ipinfo.io service and obtain the top scores from server.
  const requests = Promise.all([
    'https://ipinfo.io/json?token='.concat(token),
    url.concat('/api/v1/scores.json')
  ]
  .map((link)=>{
    return new Promise((resolve)=>{
      $.getJSON(link,json => resolve(json));
    });
  }));

  // Defining method that makes POST request to app server with
  // json housing client name, score and country for storage on
  // atlas server.
  async function submitScore(){
    let payload = await requests;
    // Collecting data and making request.
    return new Promise((resolve)=>{
      $.post(url.concat('/api/v1/submit.json'), {
        'name': $('div#submit-container input').val(),
        'country': payload[0].country,
        'score': Game.SCORE
      },
      response => resolve(response));
    });
  }

  // Making page body fadeIn, wrapping game init inside callback
  // and commencing play once div#info-container has been faded
  // out of view.
  $('body').css(show).hide().fadeIn(delay,()=>{
    Game.init();
    $('div#info-container').fadeOut(delay,()=>{
      Game.play();
    });
  });

  // Attaching click listeners to buttons inside replay container
  // with the first restarting the game and the second navigating
  // back to home page.
  const buttons = 'div#replay-container button';
  // For "Yes".
  $(buttons).eq(0).click(()=>{
    // Making score label 0.
    $('div#score-container h3 strong').text('Score: 0');
    Game.init();
    $('div#page-container').fadeIn(delay,()=>{
      Game.play();
    });
  });
  // For "No".
  $(buttons).eq(1).click(()=>{
    open(url.concat('/home'), '_self');
  });

  // Attaching click listener to button of submit container that
  // POSTs user name, score and country to our app server and
  // navigates to the app's home page when done.
  const message = 'div#message-container h1 strong';
  const submit = 'div#submit-container';
  $(submit).find('button').click(()=>{
    // Changing message text.
    const text = 'Submitting your score ! Please Wait ...';
    $(message).text(text);
    // Fading out submit container and submiting score.
    $(submit).fadeOut(delay,()=>{
      submitScore().then(()=>{
        open(url.concat('/scores'), '_self');
      });
    });
  });


  // Defining method that aids the in the implementation of the
  // Game.onOver method later.
  const helpGameOnOver = ()=>{
    // Changing message text.
    const text = `Congrats ! You made a high score of ${Game.SCORE}`;
    $(message).text(text);
    // Bringing submit container to view.
    const styles = [hide, show];
    ['replay', 'submit'].forEach((container,index)=>{
      $(`div#${container}-container`).css(styles[index]);
    });
    $('div#page-container').fadeOut(delay);
  }

  // Defining method that compares the score made by client with
  // the top five score(s) present in collection if score made is
  // deemed high enough we offer a submission otherwise replay.
  const threshold = 15000, maxScores = 5;
  Game.onOver = async ()=>{
    const payload = await requests;
    if (Game.SCORE >= threshold) {
      if (payload[1].data.length < maxScores) {
        helpGameOnOver();
      }
      else if (Game.SCORE > payload[1].data.pop().score) {
        helpGameOnOver();
      }
      else Game.onQuit();
    }
    else Game.onQuit();
  }

  // Updating score GUI on page when Game.SCORE static member is
  // updated by our Game class.
  Game.onScoreUp = ()=>{
    const text = `Score: ${Game.SCORE}`;
    $('div#score-container h3 strong').text(text);
  };

  // Brining replay container into view once quit key is pressed
  // by user or if a sufficiently high score is not made.
  Game.onQuit = ()=>{
    $('div#page-container').fadeOut(delay);
  };

});
