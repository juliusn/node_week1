let picArray;
let map;
let sort;
let update;
let initMap;

const thumbsList = document.querySelector('.thumbsList');
const request = new Request('pictures.json');
const select = document.querySelector('.sort');

fetch(request).then((response) => {
  return response.json();
}).then((json) => {
  picArray = json;

  select.removeAttribute('disabled');
  const opt1 = document.createElement('option');
  opt1.value = 'title';
  opt1.text = 'Title';

  const opt2 = document.createElement('option');
  opt2.value = 'category';
  opt2.text = 'Category';

  const opt3 = document.createElement('option');
  opt3.value = 'date';
  opt3.text = 'Date';

  select.add(opt1);
  select.add(opt2);
  select.add(opt3);
  select.setAttribute('onchange', 'sort()');

  update();
});

class Modal {
  constructor(overlay, pic) {
    this.overlay = overlay;
    const closeButton = overlay.querySelector('.button-close');
    const img = overlay.querySelector('.image-display');
    const location = {lat: pic.coordinates.lat, lng: pic.coordinates.lng};
    map = new google.maps.Map(document.querySelector('.map-container'), {
      zoom: 4,
      center: location,
      disableDefaultUI: true,
    });
    const marker = new google.maps.Marker({
      position: location,
      map: map,
    });

    img.src = pic.original;
    closeButton.addEventListener('click', this.close.bind(this));
    overlay.addEventListener('click', e => {
      if (e.srcElement.id === this.overlay.id) {
        this.close();
      }
    });
  }

  open() {
    this.overlay.classList.remove('is-hidden');
  }

  close() {
    this.overlay.classList.add('is-hidden');
  }
}

initMap = () => {
  const uluru = {lat: -25.363, lng: 131.044};
  map = new google.maps.Map(document.querySelector('.map-container'), {
    zoom: 4,
    center: uluru,
    disableDefaultUI: true,
  });
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}

sort = () => {
  const selected = select.options[select.selectedIndex].value;
  picArray.sort((a, b) => a[selected] > b[selected]);
  update();
}

update = () => {
  thumbsList.innerHTML='';
  picArray.map((pic) => {

    const thumbsListItem = document.createElement('li');
    thumbsListItem.setAttribute('class', 'thumbs-item');

    const img = document.createElement('img');
    img.setAttribute('class', 'image-thumbnail');
    img.src = pic.thumbnail;
    img.addEventListener('click', (e) => {
      const modal = new Modal(document.querySelector('.modal-overlay'), pic);
      window.openModal = modal.open.bind(modal);
      window.openModal();
    });
    const a = document.createElement('a');
    a.appendChild(img);
    thumbsListItem.appendChild(a);

    const imageInfoList = document.createElement('ul');

    const title = document.createElement('li');
    title.appendChild(document.createTextNode('Title: ' + pic.title));
    imageInfoList.appendChild(title);

    const category = document.createElement('li');
    category.appendChild(document.createTextNode('Category: ' + pic.category));
    imageInfoList.appendChild(category);

    const details = document.createElement('li');
    details.appendChild(document.createTextNode('Details: ' + pic.details));
    imageInfoList.appendChild(details);

    const date = document.createElement('li');
    const dateReadable = new Date(pic.time.replace(' ', 'T')).toDateString();
    date.appendChild(document.createTextNode('Date: ' + dateReadable));
    imageInfoList.appendChild(date);

    const imageInfoWrapper = document.createElement('div');
    imageInfoWrapper.setAttribute('class', 'image-info');
    imageInfoWrapper.appendChild(imageInfoList);
    thumbsListItem.appendChild(imageInfoWrapper);

    thumbsList.appendChild(thumbsListItem);
  });
}