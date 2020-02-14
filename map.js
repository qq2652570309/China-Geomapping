
//--button--
d3.select("body").append("div").attr("id", "buttonBar");

d3.select("#buttonBar").append("div").attr("id","cityOrProvince");
d3.select("#cityOrProvince").append("button").attr("id", "noCity").text("Provinces");
d3.select("#cityOrProvince").append("button").attr("id", "hasCity").text("Cities");

d3.select("#buttonBar").append("div").attr("id","PGG");
d3.select("#PGG").append("button").attr("id", "Populaion_Button").text("Population");
d3.select("#PGG").append("button").attr("id", "GDP_Button").text("GDP");
d3.select("#PGG").append("button").attr("id", "PGDP_Button").text("GDP Per Capita");


//var IsCity = true;//是否是city状态
//var IsGDP = false;//是否是gdp状态
var mod = {IsProvince:true, IsCity:false, IsGDP:false, IsPOP:true, IsPGDP:false, IsRest: true};

var width  = 1000;
var height = 600;
var svg = d3.select("body").append("svg").attr("id","svg").attr("class","svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g").attr("id", "map");

var originalRectangleProporty = {ry:0, ry_increase:50, rx:0, width:20, heigh:20,
                        ny:15, ny_increase:50, nx:30, font_size:"20px", 
                        population_interval:2500, gdp_interval:16000, pgdp_interval:20000,
                        population_city_interval:300, gdp_city_interval:2200,
                        intialPop : 0, intialgdp : 0, intialpgdp : 20000
                        };


//set projection
var projection = d3.geo.mercator()
    .center([100, 35])
    .scale(650)
    .translate([400, 380]);

//create 2D path
var path = d3.geo.path().projection(projection);

//-----------------define citytip--------------

var body = d3.select("body").append("div").attr("id", "citytip2").attr("class","hidden");
document.getElementById("citytip2").innerHTML = "<div id=\"Eastern\">Eastern Cities<br>"+
                                                        "<button id="+"HaerbinB"+" style=\"font-size:15px\">Harbin</button>"+
                                                        "<button id="+"ShenyangB"+" style=\"font-size:15px\">Shenyang</button>"+
                                                        "<button id="+"BeijingB"+" style=\"font-size:15px\">Beijing</button>"+
                                                        "<button id="+"TianjinB"+" style=\"font-size:15px\">Tianjin</button>"+
                                                        "<button id="+"ShijiazhuangB"+" style=\"font-size:15px\">Shijiazhuang</button><br>"+
                                                        "<button id="+"HefeiB"+" style=\"font-size:15px\">Hefei</button>"+
                                                        "<button id="+"ShanghaiB"+" style=\"font-size:15px\">Shanghai</button>"+
                                                        "<button id="+"HangzhouB"+" style=\"font-size:15px\">Hangzhou</button>"+
                                                        "<button id="+"ChangshaB"+" style=\"font-size:15px\">Changsha</button>"+
                                                        "<button id="+"HongkongB"+" style=\"font-size:15px\">HongKong</button><br>"+
                                                "</div>"+

                                                "<div id=\"Western\" >Western Cities<br>"+
                                                        "<button id="+"WulumuqiB"+" style=\"font-size:15px\">Wulumuqi</button>"+
                                                        "<button id="+"XianB"+" style=\"font-size:15px\">Xian</button>"+
                                                        "<button id="+"LasaB"+" style=\"font-size:15px\">Lasa</button><br>"+
                                                        "<button id="+"ChengduB"+" style=\"font-size:15px\">Chengdu</button>"+
                                                        "<button id="+"LijiangB"+" style=\"font-size:15px\">Lijiang</button>"+
                                                        "<button id="+"XiningB"+" style=\"font-size:15px\">Xining</button>"+                     
                                                "</div>"+
                                                "<div>"+
                                                "<button id="+"restB"+" style=\"font-size:15px\">RESET CITIES</button>"+
                                                "</div>";


//-------------------------Define Tooltip---------------------------------------------------
d3.select("body").append("div").attr("id", "tooltip").attr("class","hidden");


//set Province color domain
var colorPopulation = d3.scale.threshold()
    .domain([0,2500,5000,7500,10000])//万人,2500
    .range(["#ffeedd","#ffeedd","#ffd1a4","#ffaf60","#ff8000","#844200"]);

var colorCityPopulation = d3.scale.threshold()
    .domain([0,300,600,900,1200])//万人,300
    .range(["#ffeedd","#ffeedd","#ffd1a4","#ffaf60","#ff8000","#844200"]);


var colorGDP = d3.scale.threshold()
    .domain([0,16000,32000,48000,64000])//亿元,间隔16000
    .range(["#ecffff","#ecffff","#bbffff","#4dffff","#00aeae","#005757"]);

var colorCityGDP = d3.scale.threshold()
    .domain([0,2200,4400,6600,8800])//亿元,间隔2200
    .range(["#ecffff","#ecffff","#bbffff","#4dffff","#00aeae","#005757"]);


var colorPGDP = d3.scale.threshold()
    .domain([20000,40000,60000,80000,100000])//元,间隔 20000
    .range(["#ffe6ff","#ffe6ff","#ffa6ff","#ff44ff","#d200d2","#750075"]);

//-----create arrow---------------------------------------


//-----------------定义尺度条的区域------------------------
var rectArea = svg.append("g")
    .attr("class", "rectArea")
    .attr("id", "rectArea")
    .attr("transform", "translate("+(width*5/6)+","+height/6+")");
	
//----------------begin draw map-------------------------------------------
d3.json("China.json",function(error, root) {
    
    if (error){return console.error(error);}    
    
    var mapPath = g.selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr("id", "drawPath");
    
    mapPath
        .attr("class",startShow)
        .attr("stroke","#000")
        .attr("stroke-width",1)
        .attr("d", path)
        .attr("fill", colorSituation)
        .style("opacity", 1)
//        .on("click",clickfunction)
        .on("mouseover",mouseoverFunction)
        .on("mouseout",mouseoutFunction);
              

  
//------button part-------------------------------------------------------------
    d3.select("#hasCity").on("click", hasCityFunction);
    d3.select("#noCity").on("click", noCityFunction);
    d3.select("#GDP_Button").on("click", GDPFillFunction);
    d3.select("#Populaion_Button").on("click", PopulationFillFunction);
    d3.select("#PGDP_Button").on("click", PGDPFillFunction);
    
    
    d3.select("#HaerbinB").on("mousedown", cityLineFunction);
    d3.select("#ShenyangB").on("mousedown", cityLineFunction);
    d3.select("#BeijingB").on("mousedown", cityLineFunction);
    d3.select("#TianjinB").on("mousedown", cityLineFunction);
    d3.select("#ShijiazhuangB").on("mousedown", cityLineFunction);
    d3.select("#HefeiB").on("mousedown", cityLineFunction);
    d3.select("#ShanghaiB").on("mousedown", cityLineFunction);
    d3.select("#HangzhouB").on("mousedown", cityLineFunction);
    d3.select("#ChangshaB").on("mousedown", cityLineFunction);
    d3.select("#LijiangB").on("mousedown", cityLineFunction);
    d3.select("#XiningB").on("mousedown", cityLineFunction);
    d3.select("#HongkongB").on("mousedown", cityLineFunction);
    d3.select("#WulumuqiB").on("mousedown", cityLineFunction);
    d3.select("#LasaB").on("mousedown", cityLineFunction);
    d3.select("#XianB").on("mousedown", cityLineFunction);
    d3.select("#ChengduB").on("mousedown", cityLineFunction);
    d3.select("#restB").on("mousedown", restCityColor);
    
    d3.select("#BeijingA").on("mousedown", cityLineFunction);
    d3.select("#TianjinA").on("mousedown", cityLineFunction);
    d3.select("#ShanghaiA").on("mousedown", cityLineFunction);
    d3.select("#restA").on("mousedown", restCityColor);
    
// -----------------------------keyboard--------------------  
    document.onkeydown=function(event){
        var keydown = event || window.event || arguments.callee.caller.arguments[0];  
        
        if(keydown && keydown.keyCode==77){
            console.log("m");
        }
        
        
        //city or province button
        if(keydown && keydown.keyCode==13){ // enter
            var buttonName = d3.select("#buttonBar").select("#showCity").text();
            
            
            if(buttonName == "only Provinces"){
                onelyProvinces() 
            }else if(buttonName == "showCity"){
                showCity();
            }
        }
    }; 
    
    
//-----------------------------------------function part------------------------------------    
    
    //--------------- click function part --------------------------------------
    function clickfunction(){
        var yPosition = event.clientY;
        var xPosition = event.clientX;
        console.log("x: "+xPosition)
        console.log("y: "+yPosition)
    }
    
    function startShow(d,i){
        if(i<34){
            return false;
        }else{
            return "hidden";   

        }
    }
    
    //----------------change color function-----------------------
    
    //show cities or provinces
    function colorSituation(d,i){ 
        if(mod.IsProvince && mod.IsCity==false){
            return provinceColor(d,i);
        }else if(mod.IsProvince==false && mod.IsCity){
            if(i<34 && d.properties.id != 82 && d.properties.id != 81 && d.properties.id != 31 &&
                     d.properties.id != 31 && d.properties.id != 12 && d.properties.id != 11){
                return "lightgray"
            }else if(d.properties.id>500 || d.properties.id == 82 || d.properties.id == 81 || d.properties.id == 31 ||
                     d.properties.id == 31 || d.properties.id == 12 || d.properties.id == 11){
                return cityColor(d,i);   
            }
        }
    }
    
    //change provinces color
    function provinceColor(d,i){
        if(mod.IsPOP && mod.IsGDP==false && mod.IsPGDP==false){
            rectPopulation();
            return colorPopulation(d.properties.population2014);
        }else if(mod.IsPOP==false && mod.IsGDP && mod.IsPGDP==false){
            rectGDP();
            return colorGDP(d.properties.gdp2014);
        }else if(mod.IsPOP==false && mod.IsGDP==false && mod.IsPGDP){
            rectPGDP();
            return colorPGDP(d.properties.pgdp);
        }
    }
    
    
    //change cities color
    function cityColor(d,i){
         if(mod.IsPOP && mod.IsGDP==false && mod.IsPGDP==false){
            rectPopulation();
            return colorCityPopulation(d.properties.population2014);
        }else if(mod.IsPOP==false && mod.IsGDP && mod.IsPGDP==false){
            rectGDP();
            return colorCityGDP(d.properties.gdp2014);
        }else if(mod.IsPOP==false && mod.IsGDP==false && mod.IsPGDP){
            rectPGDP();
            return colorPGDP(d.properties.pgdp);
        }
    }
    
    
//----------------------button fucntion ------------------    
    
    //Cities button
    function hasCityFunction(){
        mod.IsProvince = false;
        mod.IsCity = true;
        d3.select("#map").selectAll("path").attr("class",false)
            .attr("fill",colorSituation);
        
        var totalWidth = document.body.clientWidth;
        var halfWidth = totalWidth/2;
        
        d3.select("#citytip2")
            .classed("hidden", false);
        d3.select("#buttonTitle").classed("hidden", false);
        
    }
    
    //Provinces button
    function noCityFunction(){
        mod.IsProvince = true;
        mod.IsCity = false;
        d3.selectAll("path").attr("class",function(d,i){
            if(i<34){
                return false;
            }else{
                return "hidden";   
            }    
        }).attr("fill",colorSituation);
        
        d3.select("#citytip2").classed("hidden", true);
        d3.select("#buttonTitle").classed("hidden", true);
        
    }
    
    //GDP button
    function GDPFillFunction(){
        mod.IsGDP = true;
        mod.IsPOP = false;
        mod.IsPGDP = false;
        d3.selectAll("path").attr("fill",colorSituation);
        rectGDP();
    }
    
    //Population button
    function PopulationFillFunction(){
        mod.IsGDP = false;
        mod.IsPOP = true;
        mod.IsPGDP = false;
        d3.selectAll("path").attr("fill",colorSituation);
        rectPopulation();
    }
    
    //GDP Per Capita button
    function PGDPFillFunction(){
        mod.IsGDP = false;
        mod.IsPOP = false;
        mod.IsPGDP = true;
        d3.selectAll("path").attr("fill",colorSituation);
        rectPGDP();
    }
    
    function cityLineFunction(){
        var name = d3.select(this).text();
//        var x2, y2;
        mod.IsRest = false;
        mapPath.attr("fill", function(d,i){
            var  colorArg = d.properties.population2014;
            if( d.properties.ename == name || d.properties.name == name ){
                return "yellow";
            }else{
                return "lightgrey";
            }
        });
    }

    function restCityColor(){
        mod.IsRest = true;
        mapPath
        .attr("fill", colorSituation);
    }
    
    
    
    //------------------------- 鼠标接触 function -----------------------------------------
    
    //mouse over function
    function mouseoverFunction(d,i){
        
        if(mod.IsProvince && mod.IsCity==false){
            if(mod.IsRest){
                d3.select(this).attr("fill","yellow");
            }
            d3.select("#tooltip").classed("hidden", false);
        }else if(mod.IsProvince==false && mod.IsCity){
            if(i<34 && d.properties.id != 82 && d.properties.id != 81 && d.properties.id != 31 &&
                     d.properties.id != 31 && d.properties.id != 12 && d.properties.id != 11){
                
            }else if(d.properties.id>500 || d.properties.id == 82 || d.properties.id == 81 || d.properties.id == 31 ||
                     d.properties.id == 31 || d.properties.id == 12 || d.properties.id == 11){
                if(mod.IsRest){
                    d3.select(this).attr("fill","yellow");
                }
                d3.select("#tooltip").classed("hidden", false);  
            }
        }
        
        
        
        // define the position of tooltip
        var yPosition = event.clientY;
        var xPosition = event.clientX;
        
        //Update the tooltip position and value
        d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");
        var x = Math.round(d.properties.gdp2014/10);
        var y = Math.sqrt((d.properties.gdp2014/10 - x)*(d.properties.gdp2014/10 - x));
        y = Math.round(y*100);
        var gdp1 = x+"."+y;        
        var population = Math.round(d.properties.population2014/10)/10;
        
        var Name;
        if(i<34){
            Name = d.properties.name;
        }else{
            Name = d.properties.ename;   
        }
        var gdp2 = Math.round(gdp1);
        var pgdp = Math.round(d.properties.pgdp);
        
        document.getElementById("tooltip").innerHTML = "<center style=\"font-weight:bold\">"+Name+"</center> <br>"+ 
            "Population<mao1>:</mao1> <em>"+population+" Million People</em><br>"+
            "GDP<mao2>:</mao2> <em>"+gdp2+" Billion Yuan</em><br>"+
            "GDP Per Capita<mao3>:</mao3> <em>"+pgdp+" Yuan</em><br>";
        
                
    }
    
    //mouse out function
    function mouseoutFunction(d,i){
        d3.select("#tooltip").classed("hidden", true);
        if(mod.IsRest){
            d3.selectAll("path").attr("fill", colorSituation);
        }
    }

    
    
    //--------------------------改变刻度条-----------------------------
    
    rectPopulation();
//    rectGDP();
//    rectPGDP();
    
    //这个是画人口刻度条
    function rectPopulation(d,i){
        originalRectangleProporty.ry=0;
        originalRectangleProporty.ny=15;
        
        
        var rectProporty  = originalRectangleProporty;
        
        var interval;
        mod.IsCity ? (interval = rectProporty.population_city_interval) : (interval = rectProporty.population_interval);
        
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        //-----------方块-----------
        var rectAreaRange;
        
        if(mod.IsCity){
            rectAreaRange = rectArea.selectAll("rect")
                .data(colorCityPopulation.domain().map(function(d, i) {
                    return {
                        z: d
                    };
                }))
        }else{
            rectAreaRange = rectArea.selectAll("rect")
                .data(colorPopulation.domain().map(function(d, i) {
                    return {
                        z: d
                    };
                }))
        }
        
        rectAreaRange
        .enter().append("rect")
        .attr("id", "rectPopulation")
        .attr("width", rectProporty.width)
//        .attr("x",760)
        .attr("y", function(d) {
            rectProporty.ry+=rectProporty.ry_increase;
            return rectProporty.ry;
        })
        .attr("height",rectProporty.heigh)
        .style("fill", function(d) {
            if(mod.IsCity){
                return colorCityPopulation(d.z+interval-1); 
            }else{
                return colorPopulation(d.z+interval-1);
            }
        })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
            var maxRange = d.z+interval;
            (maxRange == 1500) ? (maxRange = 10000000000000) : (maxRange = d.z+interval);
            mapPath.attr("fill", function(d,i){
            var  colorArg = d.properties.population2014;
                if( colorArg >= minRange && colorArg < maxRange ){
                    
                    if(mod.IsCity){
                        if(d.properties.id>500 || d.properties.id == 82 || d.properties.id == 81 || d.properties.id == 31 ||
                     d.properties.id == 31 || d.properties.id == 12 || d.properties.id == 11){
                            return "yellow"; 
                        }else{
                            return "lightgrey";
                        }
                    }else{
                        return "yellow";
                    }
                }else{
//                    if(mod.IsCity){
//                        if(d.properties.id>500 || d.properties.id == 82 || d.properties.id == 81 || d.properties.id == 31 ||
//                     d.properties.id == 31 || d.properties.id == 12 || d.properties.id == 11){
//                            return colorCityPopulation(colorArg);
//                        }else{
//                            return "lightgrey";
//                        }
//                    }else{
//                        return colorPopulation(colorArg);
//                    }
                    return "lightgrey";
                }
             });
        })
        .on("mouseout",mouseoutFunction);
        
        //----------刻度-------------
        var pop=0;
        rectArea.selectAll("text")
        .data(colorPopulation.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            rectProporty.ny+=rectProporty.ny_increase;
            return rectProporty.ny;
        })
        .attr("x", rectProporty.nx)
        .style("text-anchor", "end")
        .attr("font-size", rectProporty.font_size)
        .text(function(d){
            return (d.z == 10000) ? ("over "+pop/100) : ( pop/100+"-"+(pop+=interval)/100 );
        })
        .style("fill","black")
        .style("text-anchor","start");
        
        rectArea.append("text")
        .attr("id","unit")
        .attr("y", rectProporty.ny+50)
        .attr("x", rectProporty.nx-20)
        .style("fill","black")
        .style("text-anchor","start")
        .style("font-size","20px")
        .text("People (Million)");
    }
    
    //这个是画刻度条GDP
    function rectGDP(d,i){
        originalRectangleProporty.ry=0;
        originalRectangleProporty.ny=15;
        
        
        var rectProporty  = originalRectangleProporty;
        
        var interval;
        mod.IsCity ? (interval = rectProporty.gdp_city_interval) : (interval = rectProporty.gdp_interval);
        
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        //-----------方块-----------
        var rectAreaRange;
        
        if(mod.IsCity){
            rectAreaRange = rectArea.selectAll("rect")
                .data(colorCityGDP.domain().map(function(d, i) {
                    return {
                        z: d
                    };
                }))
        }else{
            rectAreaRange = rectArea.selectAll("rect")
                .data(colorGDP.domain().map(function(d, i) {
                    return {
                        z: d
                    };
                }))
        }
        
        rectAreaRange
        .enter().append("rect")
        .attr("id", "rectGDP")
        .attr("width", rectProporty.width)
//        .attr("x",760)
        .attr("y", function(d) {
            rectProporty.ry+=rectProporty.ry_increase;
            return rectProporty.ry;
        })
        .attr("height",rectProporty.heigh)
        .style("fill", function(d) { 
            if(mod.IsCity){
                return colorCityGDP(d.z+interval-1);
            }else{
                return colorGDP(d.z+interval-1);
            }
        })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
            var maxRange = d.z+interval;
            (maxRange == 11000) ? (maxRange = 10000000000000) : (maxRange = d.z+interval);
            mapPath.attr("fill", function(d,i){
                var  colorArg = d.properties.gdp2014;
                if( colorArg >= minRange && colorArg < maxRange ){
                    console.log(maxRange)
                    if(mod.IsCity){
                        if(d.properties.id>500|| d.properties.id == 82 || d.properties.id == 81 || d.properties.id == 31 ||
                     d.properties.id == 31 || d.properties.id == 12 || d.properties.id == 11){
                            return "yellow"; 
                        }else{
                            return "lightgrey";
                        }
                    }else{
                        return "yellow";
                    }
                }else{
//                    if(mod.IsCity){
//                        if(d.properties.id>500 || d.properties.id == 82 || d.properties.id == 81 || d.properties.id == 31 ||
//                     d.properties.id == 31 || d.properties.id == 12 || d.properties.id == 11){
//                            return colorCityGDP(colorArg);
//                        }else{
//                            return "lightgrey";
//                        }
//                    }else{
//                        return colorGDP(colorArg);
//                    }
                    return "lightgrey";
                }
             });
        })
        .on("mouseout",mouseoutFunction);
        
        //----------刻度-------------
        var pop=0;
        rectArea.selectAll("text")
        .data(colorGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            rectProporty.ny+=rectProporty.ny_increase;
            return rectProporty.ny;
        })
        .attr("x", rectProporty.nx)
        .style("text-anchor", "end")
        .attr("font-size", rectProporty.font_size)
        .text(function(d){
            return (d.z == 64000) ? ("over "+pop/10) : (pop/10+"-"+(pop+=interval)/10);
//            return pop/10+"-"+(pop+=interval)/10;
        })
        .style("fill","black")
        .style("text-anchor","start");
        
        rectArea.append("text")
        .attr("id","unit")
        .attr("y", rectProporty.ny+50)
        .attr("x", rectProporty.nx-20)
        .style("fill","black")
        .style("text-anchor","start")
        .style("font-size","20px")
        .text("Yuan (Billion)");
    }
    
    //刻度条人均GDP
    function rectPGDP(d,i){
        originalRectangleProporty.ry=0;
        originalRectangleProporty.ny=15;
        
        var rectProporty  = originalRectangleProporty;
        
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        //-----------方块-----------
        rectArea.selectAll("rect")
        .data(colorPGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("rect")
        .attr("id", "rectPGDP")
        .attr("width", rectProporty.width)
//        .attr("x",760)
        .attr("y", function(d) {
            rectProporty.ry+=rectProporty.ry_increase;
            return rectProporty.ry;
        })
        .attr("height",rectProporty.heigh)
        .style("fill", function(d) { return colorPGDP(d.z+rectProporty.pgdp_interval-1); })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover", function(d,i){
            var minRange = d.z;
            mapPath.attr("fill", function(d,i){
            var  colorArg = d.properties.pgdp;
                if( colorArg >= minRange && colorArg < (minRange+rectProporty.pgdp_interval) ){
                    if(mod.IsCity){
                        if(d.properties.id>500 || d.properties.id == 82 || d.properties.id == 81 || d.properties.id == 31 ||
                     d.properties.id == 31 || d.properties.id == 12 || d.properties.id == 11){
                            return "yellow"; 
                        }else{
                            return "lightgrey";
                        }
                    }else{
                        return "yellow";
                    }
                }else{
                    return "lightgrey";
                }
             });
        })
        .on("mouseout",mouseoutFunction);
        
        //----------刻度-------------
        var pop=20000;
        rectArea.selectAll("text")
        .data(colorPGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            rectProporty.ny+=rectProporty.ny_increase;
            return rectProporty.ny;
        })
        .attr("x", rectProporty.nx)
        .style("text-anchor", "end")
        .attr("font-size", rectProporty.font_size)
        .text(function(d){
            return pop/1000+"k - "+(pop+=rectProporty.pgdp_interval)/1000+" k";
        })
        .style("fill","black")
        .style("text-anchor","start");
        
        rectArea.append("text")
        .attr("id","unit")
        .attr("y", rectProporty.ny+50)
        .attr("x", rectProporty.nx-20)
        .style("fill","black")
        .style("text-anchor","start")
        .style("font-size","20px")
        .text("Yuan");
    }    
   

    
});


 









