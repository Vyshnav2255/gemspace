from pathlib import Path
import base64, zipfile, json, struct
import xml.etree.ElementTree as ET
root=Path(__file__).parent
assets=root/'dist/assets'
names=['dewdrop','blue-spark','sea-glass','moonstone','amethyst','sunstone','rose-quartz','jade','aurora','starlight','prism','everlight']
for name in names:
    data=base64.b64encode((assets/f'{name}.png').read_bytes()).decode()
    for style in ['uncolored','glow']:
        filt='<feColorMatrix type="saturate" values="0"/>' if style=='uncolored' else '<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/><feComponentTransfer in="blur" result="soft"><feFuncA type="linear" slope="0.45"/></feComponentTransfer><feMerge><feMergeNode in="soft"/><feMergeNode in="SourceGraphic"/></feMerge>'
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760"><defs><filter id="effect" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">{filt}</filter></defs><image x="40" y="40" width="520" height="680" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{data}" filter="url(#effect)"/></svg>'
        (assets/f'{name}-{style}.svg').write_text(svg)
    outline=(assets/f'{name}.svg').read_text().replace('#968a7b','#c8c5d8')
    (assets/f'{name}-outline.svg').write_text(outline)
for style in ['outline','uncolored','color','glow']:
    with zipfile.ZipFile(root/f'dist/gemspace-{style}.zip','w',zipfile.ZIP_DEFLATED) as pack:
        for name in names:
            file=f'{name}.png' if style=='color' else f'{name}-{style}.svg'
            pack.write(assets/file,file)
        pack.write(root/'dist/LICENSE.txt','LICENSE.txt')

# Preview-only frames: align visible artwork, independently of download canvases.
# Measured alpha bounds keep the build dependency-free (see preview-bounds.json).
preview_bounds=json.loads((root/'preview-bounds.json').read_text())
previews=assets/'previews'
previews.mkdir(exist_ok=True)
for name in names:
    png=(assets/f'{name}.png').read_bytes()
    width,height=struct.unpack('>II',png[16:24])
    left,top,right,bottom=preview_bounds[name]
    art_width,art_height=right-left,bottom-top
    scale=min(480/art_width,600/art_height)
    visible_width,visible_height=art_width*scale,art_height*scale
    x,y=(600-visible_width)/2,(760-visible_height)/2
    data=base64.b64encode(png).decode()
    image=f'<image x="{x-left*scale}" y="{y-top*scale}" width="{width*scale}" height="{height*scale}" href="data:image/png;base64,{data}"/>'
    for style in ['color','uncolored','glow']:
        if style=='uncolored':
            effect='<feColorMatrix type="saturate" values="0"/>'
        elif style=='glow':
            effect='<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/><feComponentTransfer in="blur" result="soft"><feFuncA type="linear" slope="0.45"/></feComponentTransfer><feMerge><feMergeNode in="soft"/><feMergeNode in="SourceGraphic"/></feMerge>'
        else:
            effect=''
        defs=f'<defs><filter id="effect" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">{effect}</filter></defs>' if effect else ''
        content=f'<g filter="url(#effect)">{image}</g>' if effect else image
        (previews/f'{name}-{style}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">{defs}{content}</svg>')
    outline=ET.fromstring((assets/f'{name}-outline.svg').read_text())
    polygon=outline.find('{http://www.w3.org/2000/svg}polygon')
    points=[tuple(map(float,p.split(','))) for p in polygon.attrib['points'].split()]
    xs,ys=zip(*points)
    # Include the outline stroke in its fitted bounds. Each silhouette occupies
    # the same visible rectangle as this stone's colored artwork.
    vx,vy=min(xs)-.5,min(ys)-.5
    vw,vh=max(xs)-min(xs)+1,max(ys)-min(ys)+1
    outline.set('viewBox',f'{vx} {vy} {vw} {vh}')
    outline.set('x',str(x));outline.set('y',str(y))
    outline.set('width',str(visible_width));outline.set('height',str(visible_height))
    outline.set('preserveAspectRatio','none')
    ET.register_namespace('','http://www.w3.org/2000/svg')
    content=ET.tostring(outline,encoding='unicode')
    (previews/f'{name}-outline.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">{content}</svg>')
