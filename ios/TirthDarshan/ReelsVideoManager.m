#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(ReelsVideoManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(src, NSString)
RCT_EXPORT_VIEW_PROPERTY(paused, BOOL)

@end
