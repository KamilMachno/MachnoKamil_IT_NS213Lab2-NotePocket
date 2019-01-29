//Kamil Machno
document.addEventListener('DOMContentLoaded', appStart)

let note_id = 0

//Tablica na usuniete elenety
let usunieteTbl = []

let notatkiStr = {
    id: "",
    title: "",
    text: "",
    data: "",
    color: "",
}
let notatkiTbl = []

let jsonParse = null

//-------------Funkcja startowa-----------------//
function appStart(){

    //Pobranie danych z LocalStorage i wczytanie notatek
    if(localStorage.length){
        getLocal()    
    }


    //Dodawanie nowej notatki z domyślnymi parametrami
   document.querySelector("#dodaj").addEventListener('click', function addNote(){
       addNotes("nt"+note_id,"Title"+note_id,"Text",getTermin(),"#e7cf80")
   })
   //Usuwanie z local
   document.querySelector("#clear").addEventListener('click', clearNotes)

}
//-------------Pozostałe funkcje-----------------//
//Dodawanie kolejnej notatki
function addNotes(ntId,ntTitle,ntText,ntDate,ntColor){

    //Tworzymy główny element
    let note = document.createElement("div")
    note.style.width = "200px"
    note.style.height = "200px"
    note.style.backgroundColor = ntColor
    note.className = "notes"
    //Dodawanie ID do kadej notatki
    note.id = ntId
    notatkiStr.id = ntId
    notatkiStr.color = ntColor  //Domyślny kolor notatki
    document.querySelector("#notatki").appendChild(note)


    //Tworzymy osobnego diva na tytuł 
    let title = document.createElement("div")
    title.style.width = "200px"
    title.style.height = "30px"
    title.style.backgroundColor = "#ffe386"
    title.className = "notes_title"
    note.appendChild(title)

    //Input na tytuł
    let title_text = document.createElement("input")
    title_text.value = ntTitle
    title_text.className = "title_text"
    title_text.type = "text"
    notatkiStr.title = title_text.value
    title.appendChild(title_text)
    title_text.addEventListener('change', function titleChange(){
       //Zmiana danych w tablicy
       notatkiTbl[getID(note)].title = title_text.value //Wygenerowanie ostatnich cyfr z note.id -> aktualizacja tytulu
       setLocal("notatki",notatkiTbl)
    })

    //Input na text
    let text_input = document.createElement("textarea")
    text_input.value = ntText
    text_input.className = "text_input"
    text_input.type = "text"
    notatkiStr.text = text_input.value
    note.appendChild(text_input)
    text_input.addEventListener('change', function textChange(){
        //Zmiana danych w tablicy
        notatkiTbl[getID(note)].text = text_input.value //Wygenerowanie ostatnich cyfr z note.id -> aktualizacja tytulu
        setLocal("notatki",notatkiTbl)
     })

    //Input na datę
    let data_input = document.createElement("input")
    data_input.type = "text"
    data_input.className = "date_input"
    data_input.value = ntDate
    data_input.disabled = true
    notatkiStr.data = data_input.value
    note.appendChild(data_input)

    //Div z wyborem koloru
    let color_div = document.createElement("div")
    color_div.style.width = "130px"
    color_div.style.height = "25px"
    color_div.className = "color_div"
    note.appendChild(color_div)


    //Divy z danym kolorem
    color_div.appendChild(creatDivColor("#e7cf80",note))
    color_div.appendChild(creatDivColor("#dfbb8c",note))
    color_div.appendChild(creatDivColor("#d49fa2",note))
    color_div.appendChild(creatDivColor("#aac790",note))
    color_div.appendChild(creatDivColor("#98bbe4",note))

    //Dodawanie przycisku do usuwania
    let cancel = document.createElement("div")
    cancel.className = "btn_cancel"
    cancel.style.width = "22px"
    cancel.style.height = "22px"
    cancel.addEventListener('click', function removeNotes (){
        //Usuwanie wybranej notatki
        document.querySelector("#notatki").removeChild(note)
        
        notatkiTbl[getID(note)].id="d"+note.id // Usunietej notatce zmieniamy id dodając "d" na początku
        //Notatka nie jest eyświetlana pomimo, ze istnieje
        setLocal("notatki",notatkiTbl)
    })
    title.appendChild(cancel)

    //Dodawanie struktury do tabeli     
    notatkiTbl.push(notatkiStr)
    note_id++
    notatkiStr = {}

    //Umieszczeni tablisy w LocalStorage
    setLocal("notatki",notatkiTbl)
}


//Odpowiedni format daty
function getTermin(){
    let czas = new Date()
    let dzien = czas.getDate()
    let miesiac = czas.getMonth()+1
        if(dzien<10)
            dzien="0"+dzien
        if(miesiac<10)
            miesiac="0"+miesiac
    return dzien+"-"+miesiac+"-"+czas.getFullYear()
}

//Funkcja do divów z kolorami
function creatDivColor(_color,_note){
    let col_div = document.createElement("div")
    col_div.style.width = "20px"
    col_div.style.height = "20px"
    col_div.style.borderRadius = "10px"
    col_div.style.border = "1px solid white"
    col_div.style.marginLeft = "3px"
    col_div.style.marginBottom = "5px"
    col_div.style.backgroundColor = _color
    col_div.style.display = "inline-block"
    col_div.addEventListener('click', function changeColor(){
        //aktualizacja w tablicy po zmianie koloru 
        _note.style.backgroundColor = _color
        notatkiTbl[getID(_note)].color = _color //Zmiana koloru notatki w tablicy
        setLocal("notatki",notatkiTbl)
    })
    return col_div
}

//Konwertowanie tablisy do JSON -> umieszczanoe w localStorage
function setLocal(whereSet,whatSet){
    //JSON tablice
    jsonParse = JSON.stringify(whatSet)
    localStorage.setItem(whereSet, jsonParse)
    //console.log(jsonParse)
   
}

//Pobieranie i wstwianie notatek z LocalStorage
function getLocal(){
    let curTable = JSON.parse(localStorage.getItem('notatki'))

    //  co tutaj?
    //et usuTable = JSON.parse(localStorage.getItem('usuniete'))


    let i = 0
    while(i<curTable.length)
    {
        //Jezeli ID notatki ma przedrostek "dnt" -> nie zostaje wyświetlona/ zostala usunieta
        if(curTable[i].id.substr(0,3)=="dnt"){
                    //uzupelnianie tablicy bez wyświetlania notatki
                    notatkiStr.id = curTable[i].id
                    notatkiStr.title = curTable[i].title
                    notatkiStr.text = curTable[i].text
                    notatkiStr.data = curTable[i].data
                    notatkiTbl[i]=notatkiStr
                    notatkiStr ={}
                    //zmiększenie note_id aby przpisować własniowe id do nowych notatek
                    note_id++
                    i++       
            
        }
        else{
            addNotes(curTable[i].id,curTable[i].title,curTable[i].text,curTable[i].data,curTable[i].color)
            i++
        }
    }
}

//Czyszczenie LocalStorage
function clearNotes(){
    localStorage.clear()
    notatkiTbl = []
    notatkiStr = {}
    note_id = 0
    location.reload()
    //console.log(localStorage)
}

//Generowanie note_id z ID
function getID(noteId){
    let leng = noteId.id.length
    //Długość note.id - 2 pierwsze znaki (nt) = ID
    return noteId.id.substr(2,leng-2)
}

