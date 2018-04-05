
//player thumbnail, title and band namme
let $musicViewer = {
  // get GetMusicItem() {
  //   return this.MusicItem;
  // },
  get GetMusicThumb() {
    return this.musicThumb;
  },
  get GetMusicTitle() {
    return this.musicTitle;
  },
  // set SetMusicItem(item) {
  //   this.MusicItem = item;
  // },
  set SetMusicThumb(src) {
    this.musicThumb = src;
  },
  set SetMusicTitle(title) {
    this.musicTitle = title
  },
  MusicItem: 0,
  musicThumb: $("#music-thumb"),
  musicTitle: $("#music-title")
}

//player buttons
let $buttons = {
  get PlayBtn() {
    return $("#play-pause-icon");
  },
  get SkipPrevBtn() {
    return $("#skip-previous-icon");
  },
  get SkipNextBtn() {
    return $("#skip-next-icon");
  },
  get ShuffleBtn() {
    return $("#shuffle-icon");
  },
  get RepeatBtn() {
    return $("#repeat-icon");
  },
  get VolumeBtn() {
    return $("#volume-icon");
  },
  get VolumeInp() { //input range
    return $("#volume");
  },
  //get/set shuffle btn opacity
  set SetShuffle(canShuffle) {
    this.ShuffleFile = canShuffle;
  },
  get GetShuffle() {
    return this.ShuffleFile;
  },
  //get/set repeat btn opacity
  set SetRepeat(canRepeat) {
    this.RepeatPlaylist = canRepeat;
  },
  get GetRepeat() {
    return this.RepeatPlaylist;
  },
  ShuffleFile: false,
  RepeatPlaylist: false
}

//audio inputs (controls)
let $audio = {
  get Media() {
    return $("audio").get(0);
  },
  get Source() {
    return $("source").get(0);
  },
  get Timer() {
    return $(".timer span");
  },
  get TimerBar() {
    return $("#timer-bar");
  }
}

//***************************
//$buttons functionality - changing icons and opacity
$(function() {
  //remove default audio player
  $($audio.Media).removeAttr("controls");

  //seed data
  $musicViewer.GetMusicThumb.attr("src", musicData[0].image);
  $musicViewer.GetMusicTitle.find(".music-title-name").html(musicData[0].name + "<br>");
  $musicViewer.GetMusicTitle.find(".music-title-band").html(musicData[0].band);

  // change play icon to pause and oposite when needed
  $buttons.PlayBtn.on("click", function() {
    if($(this).text() === "play_circle_filled") {
      $(this).text("pause_circle_filled");
    }
    else {
      $(this).text("play_circle_filled");
    }

    if($audio.Media.paused) {
      $(this).attr("data-icon", "u");
      $audio.Media.play();
      // $playerFunctionality.PlayFile();
    } else {
      $(this).attr("data-icon", "P");
      $audio.Media.pause();
    }
  });

  // simulate button click
  $buttons.SkipPrevBtn.on("click", function() {
    if(!$(this).hasClass("half-opacity")) {
      $(this).addClass("half-opacity");
      setTimeout(function () {
        $buttons.SkipPrevBtn.removeClass("half-opacity");
      }, 100);
    }
    $playerFunctionality.SkipPreviousFile();
  });

  // simulate button click
  $buttons.SkipNextBtn.on("click", function() {
    if(!$(this).hasClass("half-opacity")) {
      $(this).addClass("half-opacity");
      setTimeout(function () {
        $buttons.SkipNextBtn.removeClass("half-opacity");
      }, 100);
    }
    $playerFunctionality.SkipNextFile();
  });

  // change shuffle-icon opacity when clicked
  // (simulate on/off shuffle)
  $buttons.ShuffleBtn.on("click", function() {
    if($buttons.ShuffleBtn.hasClass("half-opacity")) {
      $(this).removeClass("half-opacity");
      $buttons.SetShuffle = true;
    } else {
      $(this).addClass("half-opacity");
      $buttons.SetShuffle = false;
    }
  });

  // change shuffle-icon opacity when clicked
  // (simulate on/off repeat)
  $buttons.RepeatBtn.on("click", function() {
    if($(this).hasClass("half-opacity")) {
      $(this).removeClass("half-opacity");
      $buttons.SetRepeat = true;
    } else {
      $(this).addClass("half-opacity");
      $buttons.SetRepeat = false;
    }
  });

  //show or hide volume input (to change volume)
  $buttons.VolumeBtn.on("click", function() {
    $buttons.VolumeInp.toggle(200);
  });

  //change file volume
  $buttons.VolumeInp.on("input", function() {
    var actualState = $(this).val();

    // change volume when user change value input[range]
    if(actualState < actualState + 0.01) {
      $audio.Media.volume = actualState;
    }
    if(actualState > actualState - 0.01) {
      $audio.Media.volume = actualState;
    }

    // change icon when volume goes up or down
    if(actualState >= 0.7) {
      $buttons.VolumeBtn.text("volume_up");
    } else if (actualState < 0.7 && actualState > 0.1) {
      $buttons.VolumeBtn.text("volume_down");
    } else {
      $buttons.VolumeBtn.text("volume_mute");
    }
  });

  $($audio.Media).on("timeupdate", function() {
    var minutes = Math.floor($audio.Media.currentTime / 60);
    var seconds = Math.floor($audio.Media.currentTime - minutes * 60);

    var minuteValue;
    var secondValue;

    if(minutes < 10) {
      minuteValue = "0" + minutes;
    } else {
      minuteValue = minutes;
    }

    if (seconds < 10) {
    secondValue = "0" + seconds;
    } else {
      secondValue = seconds;
    }

    var mediaTime = minuteValue + ":" + secondValue;
    //show file duraton
    $audio.Timer.text(mediaTime);
    //set max value of timebar input
    $audio.TimerBar.attr("max", $audio.Media.duration);
    //change timebar value when playing file
    $audio.TimerBar.val($audio.Media.currentTime);


    if($audio.Media.ended && $playerFunctionality.musicItem < musicData.length - 1 && !$buttons.GetRepeat) {
      //pause file first
      // $playerFunctionality.PauseFile();
      //then start playing
      //(it's avoid errors when play/pause is ansyc)
      $playerFunctionality.SkipNextFile();
    }

    if($audio.Media.ended && $playerFunctionality.musicItem <= musicData.length - 1 && $buttons.GetRepeat) {
      //pause file first
      // $playerFunctionality.PauseFile();
      //then start playing
      //(it's avoid errors when play/pause is ansyc)
      $playerFunctionality.SkipNextFile();
    }
  });

  $audio.TimerBar.on("input", function() {
    $audio.Media.currentTime = $(this).val();
  });
});

//******************************
//basic player functionality
var $playerFunctionality = new function() {

  this.musicItem = 0;
  this.PauseFile = function() {
    $audio.Media.pause();
    $audio.Media.currentTime = 0;
    $buttons.PlayBtn.attr("data-icon", "P");
  }

  this.PlayFile = function() {
    $buttons.PlayBtn.attr("data-icon", "u");
    $buttons.PlayBtn.text("pause_circle_filled");
    $audio.Media.play();
  }

  this.changeFileAndLoad = function() {
      this.PauseFile();
      $musicViewer.GetMusicThumb.attr("src", musicData[this.musicItem].image);
      $($audio.Source).attr("src", musicData[this.musicItem].file);
      $musicViewer.GetMusicTitle.find(".music-title-name").html(musicData[this.musicItem].name + "<br>");
      $musicViewer.GetMusicTitle.find(".music-title-band").html(musicData[this.musicItem].band);
      //shuffle music
      if($buttons.GetShuffle) {
        //randomize file to play
        var randomFile = Math.floor((Math.random() * musicData.length) + 1);
        //and assigne number to variable $musicViewer.GetMusicItem
        this.musicItem = randomFile;
      }
      //load new file
      $audio.Media.load();
      if($buttons.PlayBtn.text() === "pause_circle_filled") {
        this.PlayFile();
      }
  }

  this.SkipNextFile = function() {
    this.musicItem++;
    if(this.musicItem >= musicData.length) {
      this.musicItem = 0;
    }
    this.changeFileAndLoad();
  }

  this.SkipPreviousFile = function() {
    this.musicItem--;
    if(this.musicItem <= -1) {
      this.musicItem = musicData.length - 1;
    }
    this.changeFileAndLoad();
  }
};
