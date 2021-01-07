var RoleGenerator = {};
   RoleGenerator.actorAView = {}
   RoleGenerator.actorAView.ActiveSubSectionA = "CharacterSheet";
   RoleGenerator.ActiveSubSectionB = "CharacterSheet";





$(document).ready(function() {
   RoleGenerator.actorA = ActorFactory.Random();
   ActorLog(RoleGenerator.actorA.name, "Actor Created.", "actorA");
   
   RoleGenerator.actorB = ActorFactory.Random();
   ActorLog(RoleGenerator.actorB.name, "Actor Created.", "actorB");

   $('#actorA .actorName').html(RoleGenerator.actorA.name + '&nbsp;<span class="actorId">'+RoleGenerator.actorA.actorId+'</span>');
   $('#actorB .actorName').html(RoleGenerator.actorB.name + '&nbsp;<span class="actorId">'+RoleGenerator.actorB.actorId+'</span>');

   $('#lowerBar').click(function(){
   		$(this).removeClass('collapsed');
   		$(this).addClass('expanded');
   });

   $('#collapseLowerBar').click(function(){
   		$('#lowerBar').addClass('collapsed');
   		$('#lowerBar').removeClass('expanded');
   		return false;
   });


   $('.foldable.category').click(function(event){
      $(this).toggleClass('collapsed');
      $(this).toggleClass('expanded');
   });

   //TODO pre-fetch some common elements for ease of use.

   //register subsection menu
  RoleGenerator.RegisterSubSectionMenu();
});


var ActorLog = function(prefix, message, style){
   var actorStyle = !style ? "default" : style; 
   OutputLog('<div class="out_'+ actorStyle +'"><span class="out_actorLabel">'+ prefix +': </span><span class="out_actorText"></span> '+ message +'</div>');
}


function OutputLog(message)
{
   var logElement = $('#outputlog');
   if(!logElement)
      return; // no output element found.

   logElement.append('<div class="outputLogItem">'+message+'</div>');
   logElement.get(0).scrollTop = logElement.get(0).scrollHeight;
}

function ClearOutputLog()
{
   var logElement = $('#outputlog');
   if(!logElement)
      return; // no output element found.

   logElement.empty();
}



//TODO -- return back to main display
RoleGenerator.OnCharacterSheetClicked = function(element)
{
   
   if(element.parents('#actorA').length > 0)
   {
      RoleGenerator.ActiveSubSectionA = "CharacterSheet";
      OutputLog(RoleGenerator.actorA.name);
      $('#actorA .actorSubSectionContainer').html('');
      RoleGenerator.DrawActorACharacterSheet();

   }
   else if(element.parents('#actorB').length > 0)
   {
      RoleGenerator.ActiveSubSectionB = "CharacterSheet";
      OutputLog(RoleGenerator.actorB.name);
      $('#actorB .actorSubSectionContainer').html('');
   }
}


//TODO how to draw & how to refresh...
RoleGenerator.DrawActorACharacterSheet = function()
{
   var container = $('#actorA .actorSubSectionContainer');
   container.append('<div class="actorAttributesContainer">');

      RoleGenerator.DrawActorAAttributes(RoleGenerator.actorA);

      container.append('<div class="foldable collapsed category">Demographic <a href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a></div>');
      container.append('<div class="foldable content">Demographic</div>');
      container.append('<div class="foldable collapsed category">Personality <a href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a></div>');
      container.append('<div class="foldable collapsed category">Log Book <a href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a></div>');
      container.append('<div class="foldable collapsed category">Resources <a href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a> </div>');

   container.append('</div>');

   // add click events on the collapsed categories
   $('.foldable.category').click(function(event){
      $(this).toggleClass('collapsed');
      $(this).toggleClass('expanded');
   });
}

RoleGenerator.DrawActorAAttributes = function(actor)
{
   var container = $('#actorA .actorAttributesContainer');

   container.append('<div class="foldable collapsed category">Attributes &amp; Modifiers </div>' + 
      '<table class="actorAttributesMatrix" cellspacing="0" cellpadding="0">' +
         '<tr>' +
            '<td class="total" title="You have X total attributes.">TOTAL:(<span class="base">' + RoleGenerator.actorA.GetTotalBaseAttributes() + '</span><span class="mod">'+ "+"+RoleGenerator.actorA.GetTotalModifiers() +'</span>)</td>' +
            '<td class="attrbuteTotal mental" title="The score used to compute Mental Checks">MENTAL:(<span class="base">'+ RoleGenerator.actorA.GetTotalBaseMental() +'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetTotalModMental() +'</span>)</td>' +
            '<td class="attrbuteTotal physical" title="The score used to compute Physical Checks">PHYSICAL:('+ RoleGenerator.actorA.GetTotalBasePhysical() +'</span><span class="mod">'+ "+"+RoleGenerator.actorA.GetTotalModPhysical() +'</span>)</td>' +
            '<td class="attrbuteTotal social" title="The score used to compute Social Checks">SOCIAL:(<span class="base">'+ RoleGenerator.actorA.GetTotalBaseSocial() +'</span><span class="mod">'+ "+"+RoleGenerator.actorA.GetTotalModSocial() +'</span>)</td>' +
         '</tr>' +
         '<tr>' +
            '<td class="attrbuteTotal power" title="The score used to compute Power Checks">POWER:(<span class="base">'+RoleGenerator.actorA.GetTotalBasePower()+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetTotalModPower()+'</span>)</td>' +
            '<td class="attrbute power mental" title="Intelligence"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("INT")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("INT")+'</span></td>' +
            '<td class="attrbute power physical" title="Strength"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("STR")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("STR")+'</span></td>' +
            '<td class="attrbute power social" title="Presence"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("PRE")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("PRE")+'</span></td>' +
         '</tr>' +
         '<tr>' +
            '<td class="attrbuteTotal finesse" title="The score used to compute Finesse Checks">FINESSE:(<span class="base">'+RoleGenerator.actorA.GetTotalBaseFinesse()+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetTotalModFinesse()+'</span>)</td>' +
            '<td class="attrbute finesse mental" title="Wits"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("WIT")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("WIT")+'</span></td>' +
            '<td class="attrbute finesse physical" title="Dexterity"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("DEX")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("DEX")+'</span></td>' +
            '<td class="attrbute finesse social" title="Manipulation"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("MAN")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("MAN")+'</span></td>' +
         '</tr>' +
         '<tr>' +
            '<td class="attrbuteTotal resilience" title="The score used to compute Resilience Checks">RESILIENCE:(<span class="base">'+RoleGenerator.actorA.GetTotalBaseResilience()+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetTotalModResilience()+'</span>)</td>' +
            '<td class="attrbute resilience mental" title="Resolve"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("RES")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("RES")+'</span></td>' +
            '<td class="attrbute resilience physical" title="Stamina"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("STA")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("STA")+'</span></td>' +
            '<td class="attrbute resilience social" title="Composure"><span class="base">'+RoleGenerator.actorA.GetBaseAttribute("COM")+'</span><span class="mod">'+"+"+RoleGenerator.actorA.GetAttributeModifier("COM")+'</span></td>' +
         '</tr>' +
      '</table>' + 
   '<div class="txAlignC"><a href="#">View All Modifiers</a></div>' + 
   '</div>');



   
}

RoleGenerator.OnRandomizeClicked = function(element)
{
   if(element.parents('#actorA').length > 0)
   {
       OutputLog("Randomizing ActorA..." );
       RoleGenerator.actorA = ActorFactory.Random();
       ActorLog(RoleGenerator.actorA.name, "Actor Created.", "actorA");

   }
   else if(element.parents('#actorB').length > 0)
   {
       OutputLog("Randomizing ActorB..." );
       RoleGenerator.actorB = ActorFactory.Random();
       ActorLog(RoleGenerator.actorB.name, "Actor Created.", "actorB");
   }
  //repaint active view
}

RoleGenerator.OnEditClicked = function(element)
{
   console.log(element.parents('#actorA').length > 0 ? "Editing ActorA..." : "Editing ActorB...");
}

RoleGenerator.OnTemplateClicked = function(element)
{
   console.log(element.parents('#actorA').length > 0 ? "Update ActorA to a template..." : "Update ActorB to a template...");
}

RoleGenerator.OnJsonClicked = function(element)
{
   if(element.parents('#actorA').length > 0)
   {
      OutputLog("Outputting:  "+ RoleGenerator.actorA.name );
      $('#actorA .actorSubSectionContainer').html('<textarea id="actorA_out"></textarea>');
      $('#actorA_out').html(JSON.stringify(RoleGenerator.actorA));
   }  
   else if(element.parents('#actorB').length > 0)
   {
      OutputLog("Outputting:  "+ RoleGenerator.actorB.name );
      $('#actorB .actorSubSectionContainer').html('<textarea id="actorB_out"></textarea>');
      $('#actorB_out').html(JSON.stringify(RoleGenerator.actorB));
   }
   $('')


}

RoleGenerator.OnScheduleClicked = function(element)
{
   console.log(element.parents('#actorA').length > 0 ? "Viewing schedule for: ActorA..." : "Viewing schedule for: ActorB...");
}

RoleGenerator.RegisterSubSectionMenu = function()
{
   $('.actorName').click(function(event){
      RoleGenerator.OnCharacterSheetClicked($(this));
   });

   var actorSections = $('.actorOptions span');
   actorSections.each(function(index, element) 
   { 
      var handlerName = "On"+$(this).attr("subSectionAction")+"Clicked";

      if(typeof(RoleGenerator[handlerName]) != "undefined")
      {
         $(this).click(function(event)
         {
            RoleGenerator[handlerName]($(this));
         });
      } 
   });
}



var ActorASubSections = {};
var ActorBSubSections = {};

function HideSubSections()
{

}