document.getElementById('hamburger').onclick = () => {
    document.getElementsByTagName('header')[0].getElementsByTagName('ul')[0].classList.toggle('active');
}