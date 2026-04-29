import Foundation

@objc(ReelsVideoManager)
class ReelsVideoManager: RCTViewManager {

    override func view() -> UIView! {
        return ReelsVideoView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
