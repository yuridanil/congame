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
        // c.setAttribute('stroke', 'white');
        // c.setAttribute('stroke-width', 10);
        // c.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
        c.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
        c.setAttribute('opacity', .8);
        c.setAttribute('cx', Math.floor(Math.random() * width));
        c.setAttribute('cy', Math.floor(Math.random() * height));
        c.setAttribute('r', Math.floor(Math.random() * Math.min(width, height) / 2));

        // let r = Math.floor(Math.min(width, height) / 2 / (i + 2));
        // c.setAttribute('cx', Math.floor(r + Math.random() * (width - r * 2)));
        // c.setAttribute('cy', Math.floor(r + Math.random() * (height - r * 2)));
        // c.setAttribute('r', r);
        svg.appendChild(c);
    }
    return svg;
}