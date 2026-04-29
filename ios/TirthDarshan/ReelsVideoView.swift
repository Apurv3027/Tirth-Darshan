import UIKit
import AVFoundation

@objc(ReelsVideoView)
class ReelsVideoView: UIView {
    
    private var player: AVPlayer?
    private var playerLayer: AVPlayerLayer?
    private var playerItemLooper: AVPlayerLooper?
    private var queuePlayer: AVQueuePlayer?
    
    @objc var src: String? {
        didSet {
            setupPlayer()
        }
    }
    
    @objc var paused: Bool = false {
        didSet {
            if paused {
                queuePlayer?.pause()
            } else {
                queuePlayer?.play()
            }
        }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = .black
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        playerLayer?.frame = self.bounds
    }
    
    private func setupPlayer() {
        queuePlayer?.pause()
        queuePlayer?.removeAllItems()
        playerLayer?.removeFromSuperlayer()
        playerItemLooper = nil
        
        guard let src = src, let url = URL(string: src) else { return }
        
        let playerItem = AVPlayerItem(url: url)
        queuePlayer = AVQueuePlayer(playerItem: playerItem)
        
        // Loop the video
        if let queuePlayer = queuePlayer {
            playerItemLooper = AVPlayerLooper(player: queuePlayer, templateItem: playerItem)
        }
        
        playerLayer = AVPlayerLayer(player: queuePlayer)
        playerLayer?.videoGravity = .resizeAspectFill // Equivalent to cover
        playerLayer?.frame = self.bounds
        
        if let playerLayer = playerLayer {
            self.layer.addSublayer(playerLayer)
        }
        
        if !paused {
            queuePlayer?.play()
        }
    }
}
