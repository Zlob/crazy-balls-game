define(function() {
    var PAUSED = 'paused';
    var STARTED = 'started';

    var Sound = function(options){
        
        Sound.sounds.push(this);
        
        var url = options.url;
        this.multiShot = options.multiShot || false;
        //todo throw exception
        
        this.audio = [];
        
        var audioCount = this.multiShot ? 10 : 1;
        
        for(var i = 0; i < audioCount; i++){
            var audio = new Audio(url);
            audio.load();
            this.audio.push(audio);    
        }            
        
        this.play = function(options){
            if(Sound.status === PAUSED){
                return;
            };
            
            var audio = this._getFirstPausedAudio();
            
            this._setOptionsToAudio(audio, options);
            
            audio.play();
        };
        
        this.pause = function(){
            this.audio.forEach(function(audio){
                audio.pause();
            })
        };
        
        this.resume = function(){
            if(Sound.status === PAUSED){
                return;
            };
            
            this.audio.forEach(function(audio){
                if(audio.currentTime !== 0 && audio.currentTime != audio.duration){
                    audio.play();    
                }
                
            })
        };
        
        this.setOptions = function(options){
            var audio = this._getFirstPausedAudio();

            this._setOptionsToAudio(audio, options);
        }
        
        this._setOptionsToAudio = function(audio, options){
            if(options){
                if(options.volume !== undefined){
                    audio.volume = options.volume;
                }
                if(options.loop !== undefined){
                    audio.loop = options.loop;
                }
            }
        }
        
        this._getFirstPausedAudio = function(){
            if(this.multiShot){
                for(var i = 0; i  < this.audio.length; i++){
                    var audio = this.audio[i];
                    if(this.audio[i].paused){
                        return this.audio[i];
                    }
                }
                return this.audio[0];
            }
            else{
                return this.audio[0];
            }
        }        
    }
    

    
    Sound.status = STARTED;
    
    Sound.sounds = [];

    Sound.resume = function(){
        Sound.status = STARTED;
        Sound.sounds.forEach(function(sound){
            sound.resume();
        })
    }
    
    Sound.pause = function(){
        Sound.status = PAUSED;
        Sound.sounds.forEach(function(sound){
            sound.pause();
        })
    }
    
    
    return Sound;
});