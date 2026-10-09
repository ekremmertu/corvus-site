import Vision
import CoreImage
import AppKit
let a=CommandLine.arguments; let url=URL(fileURLWithPath:a[1])
let ci=CIImage(contentsOf:url)!
let h=VNImageRequestHandler(ciImage:ci); let r=VNGenerateForegroundInstanceMaskRequest()
try h.perform([r])
let res=r.results!.first!
let buf=try res.generateMaskedImage(ofInstances:res.allInstances, from:h, croppedToInstancesExtent:true)
let out=CIImage(cvPixelBuffer:buf); let ctx=CIContext()
try ctx.writePNGRepresentation(of:out, to:URL(fileURLWithPath:a[2]), format:CIFormat.RGBA8, colorSpace:CGColorSpace(name:CGColorSpace.sRGB)!)
