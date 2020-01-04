//Budget controller
var budgetController=(function(){
    var Income= function(id,description,value){
      this.id=id;
      this.description=description;
      this.value=value;
    };
    var Expanse= function(id,description,value){
      this.id=id;
      this.description=description;
      this.value=value;
      this.percentage= -1;
    };
    Expanse.prototype.setPercentage=function(){
      if( data.totalValues.inc>0)
      {
        this.percentage=Math.round(this.value / data.totalValues.inc *100) ;
      }else{
        this.percentage= -1;

      }
    };
    Expanse.prototype.retrievePercentage=function(){
      return this.percentage;
    };
    var calcTotals=function(type){
      var sum=0;
      data.totalItems[type].forEach(function(currentValue){
        sum+=currentValue.value;
      })
      data.totalValues[type]=sum;

    };
    var data={
      totalItems:{
        inc :[],
        exp :[]
      },
      totalValues:{
        inc :0,
        exp :0
      },
      budget :0,
      percentage:-1
    };
    return {
      addItem : function(type,description,value){
        var newItem,ID;
        if(data.totalItems[type].length !== 0){
          ID=data.totalItems[type][data.totalItems[type].length -1].id +1;
        }else {
          ID=0
        }

        if(type === 'inc'){
          newItem= new Income(ID,description,value);
        }
        else if(type === 'exp'){
          newItem= new Expanse(ID,description,value);
        }
        data.totalItems[type].push(newItem);
        return newItem;
      }  ,
      deleteItem: function (type,id){
        var IDs,index;
        IDs=data.totalItems[type].map(function(currElement){
          return currElement.id;
        });
        index=IDs.indexOf(id);

        if(index !=-1){
          data.totalItems[type].splice(index,1);

        } },


        calcPercentage : function(){
          data.totalItems.exp.map(function(obj){
            obj.setPercentage();
          });

        }
          ,

    getPercentage : function(){
           var  percentages=data.totalItems.exp.map(function(obj){
             return obj.retrievePercentage();
          });
          return percentages;
        }

        ,
    calculateBudget: function(){
      calcTotals('inc');
      calcTotals('exp');
      //set budget
      data.budget=data.totalValues.inc - data.totalValues.exp ;
      //set percentage
      if(data.totalValues.inc !=0){
        data.percentage=Math.round((data.totalValues.exp / data.totalValues.inc) * 100);
      }
    }  ,

    getBudget: function(){
      return {
        totalIncomes: data.totalValues.inc,
        totalExpanses: data.totalValues.exp,
        budget :data.budget,
        percentage :data.percentage
      };
    }

  }


})();
//UI controller
var UIcontroller=(function(){
  var DOMstrings={
    type :'.add__type',
    description : '.add__description',
    value : '.add__value',
    OkButton:'.add__btn',
    adjacentIncomeElement:'.income__list',
    adjacentExpanseElement: ".expenses__list",
    budgetLabel: '.budget__value',
    incomesLabel:".budget__income--value",
    expensesLabel :".budget__expenses--value",
    percentageLabel: '.budget__expenses--percentage',
    container:'.container',
    itemPercentage:'.item__percentage',
    monthLabel:'.budget__title--month'
  };

    var formatNumber=function(type,num){
    var int,dec;
    num = Math.abs(num);
    num=num.toFixed(2);
    num=num.split('.');
    int=num[0];
    dec=num[1];
    if(int.length>3){
     int= int.substring(0 , int.length-3)+','+int.substring(int.length-3 , 3);
    }
    type=== 'inc'?type='+':type='-';
    return type+' '+int+'.'+dec;
  } ;
   var nodeListForEach= function (list,callBackFn){
       for(var i=0;i<list.length;i++){
         callBackFn(list[i] , i);
       }
     };
   return {
     getInput:function(){
       return {
         inputType : document.querySelector(DOMstrings.type).value,
         inputDescription: document.querySelector(DOMstrings.description).value,
         inputValue: parseFloat(document.querySelector(DOMstrings.value).value)
       };
     } ,
     getDOMstrings:function(){
       return DOMstrings;
     } ,
     addItemList:function(obj,type){
       var html,newHTML,adjacentElement;
       if(type === 'inc'){
         adjacentElement=document.querySelector(DOMstrings.adjacentIncomeElement);
         html=  `<div class="item clearfix" id="inc-%id%">
               <div class="item__description">%description%</div>
               <div class="right clearfix">
                   <div class="item__value">%value%</div>
                   <div class="item__delete">
                       <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                   </div>
               </div>
           </div>`

       }
       else if(type === 'exp'){
         adjacentElement=document.querySelector(DOMstrings.adjacentExpanseElement);
         html=`<div class="item clearfix" id="exp-%id%">
             <div class="item__description">%description%</div>
             <div class="right clearfix">
                 <div class="item__value">%value%</div>
                 <div class="item__percentage">21%</div>
                 <div class="item__delete">
                     <button class="item__delete--btn">
                        <i class="ion-ios-close-outline"></i>
                     </button>
                 </div>
             </div>
         </div>`

       }
      newHTML=html.replace('%id%',obj.id);
      newHTML=newHTML.replace('%description%',obj.description);
      newHTML=newHTML.replace('%value%',formatNumber(type,obj.value));
      adjacentElement.insertAdjacentHTML('beforeend',newHTML);
    }  ,
    deleteItemList :function (elementID){
      document.getElementById(elementID).parentNode.removeChild(document.getElementById(elementID));
    }  ,


    clearFields :function(){
      var nodeListFields,arrayFields;
      fields= document.querySelectorAll(DOMstrings.description+','+DOMstrings.value) ;
      arrayFields=Array.prototype.slice.call(fields);
      arrayFields.forEach(function (currElemnt){
      currElemnt.value="";
      });
      document.querySelector(DOMstrings.description).focus();
    }  ,
    dispalyBudget: function(obj){
      var type;
      document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(type,obj.budget);;
      document.querySelector(DOMstrings.incomesLabel).textContent=formatNumber('inc',obj.totalIncomes);
      document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber('exp',obj.totalExpanses);
      if(obj.percentage >0){
        document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
      }
      else{
        document.querySelector(DOMstrings.percentageLabel).textContent='---';
      }

    }   ,
    dispalyPercentages: function(percentages){
      var nodeList,i=0;
      nodeList=document.querySelectorAll(DOMstrings.itemPercentage);
      nodeListForEach(nodeList , function(currElement){
        if(percentages[i]!=-1){
          currElement.textContent=percentages[i]+'%';
        }
        else{
          currElement.textContent='---';
        }

        i++;
      });


  } ,
  dispalyMonthAndYear: function(){
    var month,year;
    var now=new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"
     ];
    month=monthNames[now.getMonth()];

    year=now.getFullYear();
    document.querySelector(DOMstrings.monthLabel).textContent=month+' '+year;
  },
  changeType:function(){
    var elements;
    console.log(document.querySelectorAll(DOMstrings.description+','+DOMstrings.value))
    elements=document.querySelectorAll(DOMstrings.description+','+DOMstrings.value+','+DOMstrings.input);
    nodeListForEach (elements,function(currElement){
      currElement.classList.toggle('red-focus');
    })
    document.querySelector(DOMstrings.OkButton).classList.toggle('red');
  }

   };
})();

//Main controller
var controller=(function(budgetCtr,UIctr){
  var setUpEventHandlers=function(){
      var DOMstrings=UIcontroller.getDOMstrings();
      document.querySelector(DOMstrings.OkButton).addEventListener('click',ctrlAddItem);
      document.addEventListener('keypress',function(event){
        if (event.keyCode === 13 || event.which === 13){
          ctrlAddItem();
        }
      })
      document.querySelector(DOMstrings.container).addEventListener('click',ctrlDeleteItemL);
      document.querySelector(DOMstrings.type).addEventListener('change',UIctr.changeType)
  };
  var ctrlDeleteItemL=function(event){
    var itemID,type,id,newItemID;
    itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
      newItemID=itemID.split('-');
      type=newItemID[0];
      id=parseInt(newItemID[1]);
      //delete item from data structure
      budgetController.deleteItem(type,id);
      //remove item from UI
      UIcontroller.deleteItemList(itemID);
      //Update Budget
      updateBudget();
      // update percentage
        updatePercentage();

    }
  }

  var ctrlAddItem =function(){
    //get inout from UI and store it in input object.
    var input= UIcontroller.getInput();
    //check if input is valid
    if(input.inputDescription !== '' && input.inputValue > 0 && !isNaN(input.inputValue) ){
      //add new item
      var newItem= budgetController.addItem(input.inputType,input.inputDescription,input.inputValue)
      //add item to UI
      UIcontroller.addItemList(newItem , input.inputType);
      //clear input fields
      UIcontroller.clearFields();
      //update budget
      updateBudget();
      // update percentage
      updatePercentage();
    }

  };
  var updatePercentage= function(){
     budgetController.calcPercentage();
    var percentages= budgetController.getPercentage();
    //dispaly  percentagesArray on UI
    UIcontroller.dispalyPercentages(percentages);
  };
  var updateBudget=function(){
    //calculate Budget
    budgetController.calculateBudget();
    //get budget
    var budget= budgetController.getBudget();
    //sent budget to UI to dispaly
    UIcontroller.dispalyBudget(budget);
  };
  return {
    init:function(){
      UIcontroller.dispalyBudget(
        {totalIncomes: 0,
        totalExpanses: 0,
        budget :0,
        percentage :0
      }
    );
     UIcontroller.dispalyMonthAndYear();
      setUpEventHandlers();

    }
  };

})(budgetController,UIcontroller);
controller.init();
