(function ($) {    
    $.fn.inputTagSelector = function (options = {}) {

        const settings = $.extend({
            
            type: 'default', // default, fetch

            id: '',

            ruta: '',

            icon: ''

        }, options);
                
        $(this).each(function(i, element){
            
            if(settings.type == 'fetch' && settings.ruta !=''){

                this.classList.add('padding-rigth')
    
                $(this).wrap('<div class="position-relative"></div>');
    
                let contenedorLv1 = $(this).parent(); // postion-relative
    
                contenedorLv1.wrap('<div class="dropdown input-tags-container"></div>');
    
                let contenedorLv2 = contenedorLv1.parent();
    
                let span = document.createElement('span');
                
                span.classList.add('badged-container');
                                    
                if(settings.icon !=''){

                    let iElement = document.createElement('i');
                    
                    iElement.classList.add('bi');
                    
                    iElement.classList.add(settings.icon);

                    contenedorLv1.append(iElement);

                    this.classList.add('form-tags');
                }
    
                contenedorLv1.prepend(span);
    
    
                let dropdownMenuEl = document.createElement('div');
                
                dropdownMenuEl.classList.add('dropdown-menu');
    
                let saveListEl = document.createElement('input');
    
                saveListEl.setAttribute('type','hidden')
    
                saveListEl.classList.add('save-list');

                if(settings.id !='') {
                    saveListEl.setAttribute('id', settings.id + ((i == 0)? '' : `_${i}`) );
                };
    
                dropdownMenuEl.append(saveListEl);
    
                let divEl_1 = document.createElement('div');
    
                divEl_1.classList.add('selected')
    
                dropdownMenuEl.append(divEl_1);
    
                let divEl_2 = document.createElement('div');
    
                divEl_2.classList.add('results');
    
                dropdownMenuEl.append(divEl_2);
    
                contenedorLv2.append(dropdownMenuEl);
    
                const input = this;
                        
                const selectedContainer = input.parentElement.parentElement.querySelector(".selected");
        
                const tagContainer = input.parentElement.parentElement.querySelector(".input-tags-container");
        
                const dropdown = input.parentElement.parentElement.querySelector(".dropdown-menu");
        
                const badgeContainer = input.parentElement.parentElement.querySelector('.badged-container');
        
                const resultsContainer = input.parentElement.parentElement.querySelector(".results");

                const saveList = input.parentElement.parentElement.querySelector(".save-list");
    
                let ruta = settings.ruta;
    
                input.addEventListener('focus', function(){
        
                    resultsContainer.innerHTML = '';
        
                    if(selectedContainer.innerHTML!=''){
        
                        dropdown.style.display="block";
        
                        selectedContainer.classList.add('only-results');
        
                        if(selectedContainer.classList.contains('d-none')) selectedContainer.classList.remove('d-none');
                    }
        
                });
        
                input.addEventListener('keyup', async function(e){
        
                    e.stopPropagation();
                        
                    try {
        
                        let buscar = this.value;
        
                        if(buscar == ''){
                            
                            resultsContainer.innerHTML = ''; 
        
                            if(selectedContainer.innerHTML == ''){
        
                                dropdown.style.display="none";
                            }
                            else
                            {
                                selectedContainer.classList.add('only-results');
                            }
        
                            return false;    
        
                        }
        
                        const response = await fetch(`${ruta}${buscar}`);
        
                        const data = await response.json();
                        
                        const records = data.records;
                        
                        const results = records.map(({recordid, fields:{ nombdep, nombdist, nombprov }})=>({ id:recordid, nombdep, nombdist, nombprov, nomcompleto : `${nombdep}, ${nombprov}, ${nombdist}`  }));
                        
                        resultsContainer.innerHTML = '';                
        
                        if(selectedContainer.innerHTML==''){            
                    
                            selectedContainer.classList.add('d-none');
                        }
                        else
                        {
                            if(selectedContainer.classList.contains('d-none')){
                                selectedContainer.classList.remove('d-none');                
                            }            
                        }
        
                        selectedContainer.classList.remove('only-results');
                        
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
                                
                                input.value = '';
                            });
        
                        });
        
                        printSaveRecords();
                    
                        dropdown.style.display="block";
                            
                        
        
                    } catch (error) {
                        console.warn(error);
                    }
                
                });
            
                function printSaveRecords(object_save = {}){                                            
        
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
            }

        });      
        
    }
  
}(jQuery));