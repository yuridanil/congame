export const cartesian =
    (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

export const genSvg = (width, height, type, count, colors) => {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    for (let i = 0; i < count; i++) {
        let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute('cx', Math.floor(Math.random() * width));
        c.setAttribute('cy', Math.floor(Math.random() * height));
        c.setAttribute('r', Math.floor(Math.random() * width * height / 100));
//        c.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
        c.setAttribute('stroke', 'white');
        c.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
        c.setAttribute('stroke-width', 1 + Math.floor(Math.random() * 5));
        c.setAttribute('opacity', 0.5);
        svg.appendChild(c);
    }
    return svg;
}