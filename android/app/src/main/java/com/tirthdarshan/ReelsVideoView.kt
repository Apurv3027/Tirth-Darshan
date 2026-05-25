package com.tirthdarshan

import android.content.Context
import android.net.Uri
import android.widget.FrameLayout
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import androidx.media3.ui.AspectRatioFrameLayout

class ReelsVideoView(context: Context) : FrameLayout(context) {

    private var player: ExoPlayer? = null
    private var playerView: PlayerView? = null
    private var videoUri: String? = null
    private var isPaused: Boolean = false

    init {
        player = ExoPlayer.Builder(context).build().apply {
            repeatMode = Player.REPEAT_MODE_ALL
            playWhenReady = true
        }

        playerView = PlayerView(context).apply {
            this.player = this@ReelsVideoView.player
            useController = false
            resizeMode = AspectRatioFrameLayout.RESIZE_MODE_ZOOM // Equivalent to "cover"
            layoutParams = LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
            )
        }

        addView(playerView)
    }

    fun setSrc(uriString: String?) {
        this.videoUri = uriString
        if (uriString != null) {
            var parsedUri = Uri.parse(uriString)
            
            if (parsedUri.scheme == null) {
                val resourceName = uriString.substringBeforeLast(".")
                var resId = context.resources.getIdentifier(resourceName, "raw", context.packageName)
                if (resId == 0) {
                    resId = context.resources.getIdentifier(resourceName, "drawable", context.packageName)
                }
                if (resId != 0) {
                    parsedUri = Uri.parse("android.resource://${context.packageName}/$resId")
                }
            }
            
            val mediaItem = MediaItem.fromUri(parsedUri)
            player?.setMediaItem(mediaItem)
            player?.prepare()
            if (!isPaused) {
                player?.play()
            }
        } else {
            player?.stop()
            player?.clearMediaItems()
        }
    }

    fun setPaused(paused: Boolean) {
        this.isPaused = paused
        if (paused) {
            player?.pause()
        } else {
            player?.play()
        }
    }

    fun release() {
        player?.release()
        player = null
        playerView?.player = null
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        if (player == null) {
            player = ExoPlayer.Builder(context).build().apply {
                repeatMode = Player.REPEAT_MODE_ALL
                playWhenReady = !isPaused
            }
            playerView?.player = player
            videoUri?.let {
                setSrc(it)
            }
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        release()
    }
}
