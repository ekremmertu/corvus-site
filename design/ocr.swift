import Vision
import AppKit
let path=CommandLine.arguments[1]
let img=NSImage(contentsOfFile:path)!; var r=CGRect(origin:.zero,size:img.size)
let cg=img.cgImage(forProposedRect:&r,context:nil,hints:nil)!
let W=Double(cg.width), H=Double(cg.height)
let req=VNRecognizeTextRequest(); req.recognitionLevel = .accurate; req.recognitionLanguages=["tr-TR","en-US"]; req.usesLanguageCorrection=false
try VNImageRequestHandler(cgImage:cg).perform([req])
var out:[[String:Any]]=[]
for o in req.results ?? [] { guard let c=o.topCandidates(1).first else {continue}; let b=o.boundingBox
 out.append(["t":c.string,"x":Int(b.minX*W),"y":Int((1-b.maxY)*H),"w":Int(b.width*W),"h":Int(b.height*H)]) }
print(String(data:try JSONSerialization.data(withJSONObject:out),encoding:.utf8)!)
