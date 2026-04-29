package com.tirthdarshan

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class ReelsVideoManager : SimpleViewManager<ReelsVideoView>() {

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext): ReelsVideoView {
        return ReelsVideoView(reactContext)
    }

    @ReactProp(name = "src")
    fun setSrc(view: ReelsVideoView, src: String?) {
        view.setSrc(src)
    }

    @ReactProp(name = "paused", defaultBoolean = false)
    fun setPaused(view: ReelsVideoView, paused: Boolean) {
        view.setPaused(paused)
    }

    override fun onDropViewInstance(view: ReelsVideoView) {
        super.onDropViewInstance(view)
        view.release()
    }

    companion object {
        const val REACT_CLASS = "ReelsNativeVideo"
    }
}
