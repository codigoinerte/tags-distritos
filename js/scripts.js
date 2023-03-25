let ruta = 'https://bogota-laburbano.opendatasoft.com/api/records/1.0/search/?dataset=distritos-peru&facet=nombdep&facet=nombprov&q=';

const selectedContainer = document.getElementById("selected");

const input = document.getElementById("buscar");

const dropdown = document.querySelector(".input-tags-container .dropdown-menu");

const badgeContainer = document.querySelector('.badged-container');

input.addEventListener('focus', function(){
    dropdown.style.display="block";
});

input.addEventListener('keyup', async function(e){
    e.stopPropagation();
    
    const resultsContainer = document.getElementById("results");

    try {
        let buscar = this.value;

        const response = await fetch(`${ruta}${buscar}`);

        const data = await response.json();
        
        const records = data.records;
        
        const results = records.map(({recordid, fields:{ nombdep, nombdist, nombprov }})=>({ id:recordid, nombdep, nombdist, nombprov, nomcompleto : `${nombdep}, ${nombprov}, ${nombdist}`  }));
        
        resultsContainer.innerHTML = '';
        
        results.map(({id, nombdep, nombdist, nombprov, nomcompleto}, i)=>{

            let button = document.createElement('button');
            let identify = new Date().getTime()+i;

            button.classList.add('dropdown-item');
            button.classList.add('save-tag-item');
            
            button.setAttribute('tag-id', id);
            button.setAttribute('tag-departamento', nombdep);
            button.setAttribute('tag-provincia', nombprov);
            button.setAttribute('tag-distrito', nombdist);
            button.setAttribute('tag-fullname', nomcompleto);
            button.setAttribute('tag-identify', identify);

            button.innerHTML= nomcompleto;

            resultsContainer.append(button);

            document.querySelector(`.save-tag-item[tag-identify='${identify}']`).addEventListener('click', function(e){

                input.value = '';

                let itemResult = e.target;
            
                let tag_id = itemResult.getAttribute('tag-id');
                let tag_departamento = itemResult.getAttribute('tag-departamento');
                let tag_provincia = itemResult.getAttribute('tag-provincia');
                let tag_distrito = itemResult.getAttribute('tag-distrito');
                let tag_fullname = itemResult.getAttribute('tag-fullname');
            
                let object_save = {
                    tag_id,
                    tag_departamento,
                    tag_provincia,
                    tag_distrito,
                    tag_fullname
                };
            
                printSaveRecords(object_save);
            });

        });

        printSaveRecords();
    
        dropdown.style.display="block";
            
        

    } catch (error) {
        console.warn(error);
    }
   
});


function printSaveRecords(object_save = {}){
        
    let saveList = document.getElementById("save-list");

    let saveRecords = saveList.value;

    selectedContainer.innerHTML = '';
    
    let array = JSON.parse(saveRecords == '' ?  '[]' : saveRecords);
    
    

    if(Object.keys(object_save).length !== 0) 
    {   
        if(!array.some(district => district.tag_id == object_save.tag_id)){
            array.push(object_save);
        }
    }

    saveList.value = JSON.stringify(array);

    if(array.length > 0)
    {
        array.map((district, i)=>{

            let identify = new Date().getTime()+i;
            let button = document.createElement('button');

            button.classList.add('btn');
            button.classList.add('btn-primary');
            button.classList.add('me-1');
            button.setAttribute('data-id',district.tag_id);
            button.setAttribute('close-identify',identify);
            button.innerHTML = district.tag_distrito;        

            selectedContainer.append(button);

            button.addEventListener('click', function(e){

                let btn = e.target;

                let saveList = document.getElementById("save-list");
                
                let saveRecords = saveList.value;

                let id = btn.getAttribute('data-id');
                
                let array = JSON.parse(saveRecords == '' ?  '[]' : saveRecords);
                
                let arrayFilter = array.filter((district) => district.tag_id != id);
                
                saveList.value = JSON.stringify(arrayFilter);

                enableBadge(arrayFilter);

                btn.remove();

            });
        });

        enableBadge(array);

    }

}

function enableBadge(array=[]){

    if(badgeContainer.querySelector('span')){
        badgeContainer.querySelector('span').remove();
    }
    
    if(array.length == 0){
        badgeContainer.style.display="none";
        input.classList.remove('on-options');
        return false
    };
    
    badgeContainer.style.display='block';
    input.classList.add('on-options');        
    
    let span = document.createElement('span');
    let span_child = document.createElement('span');
    
    if(array.length == 1)
    {
        span.classList.add('badged-only-selected');
        span_child.innerHTML = array[0].tag_distrito;
        
        span.append(span_child);
    }
    else
    {
        span.classList.add('badged-counter');
        span_child.innerHTML = `${array.length} Ubicaciones`;
        span.append(span_child);
    }

    badgeContainer.append(span);
}

document.addEventListener('click', function(event){
    if (event.target !== input && event.target !== dropdown && event.target !== badgeContainer) {
        dropdown.style.display = "none";        
    }
});

badgeContainer.addEventListener('click', function(){
   
    dropdown.style.display = "block";

});