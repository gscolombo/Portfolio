export default function writer() {
    const panel = document.querySelector('.panel');
    const cursor = document.querySelector('svg.cursor');
    const rect = cursor.querySelector('rect');
    let p = Array.from(document.querySelectorAll('.panel p'));
    const dancingGuy = p[p.length - 1];
    let texts = p.map(p => p.textContent.split(''));
    p.forEach(text => text.textContent = '');

    const setCursorPosition = (i) => {
        const panelRect = panel.getBoundingClientRect();
        const cursorRect = cursor.getBoundingClientRect();
        const pRect = p[i].getBoundingClientRect();
        const x = pRect.right - pRect.left + cursorRect.width - 8;
        const y = pRect.bottom - panelRect.top - cursorRect.height - 4;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    }

    // Initial position
    cursor.style.transform = `translate3d(${10}px, ${10}px, 0px)`;
    
    let i = 0;
    let timeout = false, write = true;
    const delays = [1000, 200, 200, 300, 100, 100, 300, 300, 300, 300, 200, 200];
    setTimeout(() => {
        const timer = setInterval(() => {
            if (!texts[i].length && !timeout && texts[i+1] !== undefined) {
                write = false; 
                rect.classList.remove("stop-blinking");
                timeout = setTimeout(() => {
                    i++;
                    write = true;
                    timeout = false;
                }, delays[i]);
            }
    
            if (!texts[i+1] && !texts[i].length) {
                rect.classList.remove("stop-blinking");
                write = false;
                dancingGuy.classList.add("start");
                clearTimeout(timer);
            }
    
            if (write) {
                p[i].textContent += texts[i].shift();
                if (Math.ceil(p[i].getBoundingClientRect().width) + 20 >= Math.floor(panel.getBoundingClientRect().width - 20)) {
                    const newP = document.createElement('p');
                    p[i].insertAdjacentElement('afterend', newP);
                    p = p.slice(0, i+1).concat([newP], p.slice(i+1));
                    texts = texts.slice(0, i+1).concat([texts[i]], texts.slice(i+1));
                    i++;
                    if (texts[i][0] === " ") texts[i].shift();
                }
                rect.classList.add("stop-blinking");
                setCursorPosition(i);
            }
        }, 60);
    }, 2000);

}