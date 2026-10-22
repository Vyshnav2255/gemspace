from pathlib import Path
import base64, zipfile
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
