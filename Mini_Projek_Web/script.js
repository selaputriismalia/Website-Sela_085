// Script untuk menampilkan file PDF dan mengontrolnya serta untuk menangani efek scroll

// Tentukan URL file PDF
const pdfUrl = 'p.pdf';

// Pengaturan PDF
let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5,
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

// Unduh PDF dan tampilkan
pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('download').href = pdfUrl;
    renderPage(pageNum);
});

// Fungsi untuk menampilkan halaman PDF
function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        let viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        let renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    document.getElementById('pdf-container').appendChild(canvas);
}

// Penanganan tombol zoom in
document.getElementById('zoom-in').addEventListener('click', function() {
    scale += 0.1;
    renderPage(pageNum);
});

// Penanganan tombol zoom out
document.getElementById('zoom-out').addEventListener('click', function() {
    scale -= 0.1;
    renderPage(pageNum);
});

// Penanganan tombol putar balik
document.getElementById('rotate').addEventListener('click', function() {
    canvas.classList.toggle('rotated');
});

// Penanganan penambahan atau pengurangan halaman
canvas.addEventListener('click', function() {
    if (pageNum === pdfDoc.numPages) {
        pageNum = 1;
    } else {
        pageNum++;
    }
    renderPage(pageNum);
});

// Script untuk menangani efek scroll
window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY;
    var menu = document.getElementById('menu');
    var footer = document.querySelector('footer'); // Ambil elemen footer

    // Jarak antara bagian bawah layar dan bagian atas footer
    var distanceToFooter = footer.offsetTop - window.innerHeight;

    // Jika scroll mencapai akhir konten
    if (scrollPosition >= distanceToFooter) {
        menu.classList.remove('active');
    } else {
        menu.classList.add('active');
    }
});
