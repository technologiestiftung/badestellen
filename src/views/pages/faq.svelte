<script lang="ts">
  import * as animateScroll from 'svelte-scrollto'
  animateScroll.scrollTo(0)

  export const data = [
    {
      group: 'Allgemeines',
      content: [
        {
          head: 'An wen kann ich mich wenden, wenn ich mehr wissen möchte?',
          body:
            '<p>Mehr Informationen erhalten Sie auf der <a href="https://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/liste-der-badestellen/">Seite</a> des Landesamtes für Gesundheit und Soziales (LAGeSo) oder per E-Mail an <a href="mailto:Badegewaesserhygiene@lageso.berlin.de.">Badegewaesserhygiene@lageso.berlin.de</a>.</p>'
        },
        {
          head: 'Meine Frage ist nicht gelistet. Was kann ich tun?',
          body:
            '<p>Melden Sie die Frage an <a href="mailto:Badegewaesserhygiene@lageso.berlin.de">Badegewaesserhygiene@lageso.berlin.de</a>.</p>'
        }
      ]
    },
    {
      group: 'Badegewässerqualität',
      content: [
        {
          head: 'Woran erkenne ich, ob ein Gewässer eine gute Qualität besitzt?',
          body: `<p>Für eine gute Badegewässerqualität ist wichtig, dass das Wasser nicht durch Krankheitserreger verunreinigt ist. Diese mikrobiologischen Verunreinigungen können von den Badenden mit bloßem Auge nicht erkannt werden. Hierfür sind Laboruntersuchungen des Wassers nötig, die im Auftrag des LAGeSo alle 14 Tage durchgeführt werden. Auf Basis dieser Untersuchungen bewertet das LAGeSo die Badegewässerqualität über die gesamte Badesaison. Die aktuellen Badegewässerdaten können Sie der Übersichtskarte bzw. den Informationen zu den einzelnen Badestellen entnehmen.</p>
            <p>Neben mikrobiologischen Verunreinigungen ist außerdem wichtig, dass das Gewässer frei von Massenentwicklungen von Blaualgen ist. Solche Massenentwicklungen treten besonders dann auf, wenn die Wassertemperaturen im Sommer steigen und zusätzlich genügend Nährstoffe wie Phosphor und Stickstoff im Gewässer vorhanden sind. Unter diesen Bedingungen bilden Blaualgen Kolonien und sind auf dem Wasser als grün-schimmernde Schlieren zu erkennen.</p>`
        },
        {
          head: 'Wie steht es um die Gewässerqualität in Berlin?',
          body: `<p>Die Einstufung der Qualität der Badegewässer erfolgt aufgrund der durchgeführten Bewertung nach dem Ende jeder Badesaison. Die Einstufung beschreibt den qualitativen Zustand der Badegewässer anhand der mikrobiologischen Parameter Escherichia coli und Intestinale Enterokokken über den Zeitraum der letzten 4 Jahre. Alle 39 in Berlin ausgewiesenen Badegewässer sind nach der vergangenen Badesaison als zum Baden geeignet eingestuft worden.</p>
            <p>Eine Massenvermehrung von Blaualgen wird bei dieser Einstufung nicht berücksichtigt und wird gesondert begutachtet.</p>
            <p>Die aktuellen Untersuchungsergebnisse zur Qualität der Badegewässer können Sie der Übersichtskarte bzw. den einzelnen Badestellen entnehmen (<a href="https://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/liste-der-badestellen">Link</a>).</p>`
        },
        {
          head: 'Beeinflusst die Witterung die Wasserqualität?',
          body: `<p>Ja. Nach Starkregenfällen oder in Phasen mit Extrem-Niedrigwasser kann es immer zu Beeinträchtigungen der Wasserqualität kommen.</p>
            <p>Wenn es im Hochsommer länger heiß ist, kann aufgrund der Nährstoffgehalte verstärktes Algenwachstum auftreten. Durch erhöhtes Algenaufkommen kann es zu Sichttiefen von weniger als einem Meter kommen.</p>`
        },
        {
          head:
            'Gab es in den letzten Jahren einen Trend hinsichtlich der Wasserqualität?',
          body: `<p>Die Wasserqualität an den 39 Badestellen ist in den letzten Jahren meist sehr gut bis gut, allerdings können, wie schon oben genannt, Starkregenfälle besonders an der Unterhavel Beeinträchtigungen der Badegewässerqualität nach sich ziehen.</p>
            <p>Zur Verbesserung der Wasserqualität haben über die Jahre verschiedene Dinge beigetragen:</p>
            <ul>
              <li>Gewässersanierung</li>
              <li>Oberflächenwasseraufbereitungsanlagen</li>
              <li>Verbesserung der Klärwerksabläufe und zukünftige Abwasserdesinfektion</li>
              <li>Zusätzliche unterirdische Stauräume zur Vermeidung von Mischwasserüberläufen</li>
            </ul>`
        },
        {
          head: 'Wird die Gewässerqualität in Berlin überprüft?',
          body: `<p>Ob das Wasser in einem Badegewässer auch tatsächlich gesundheitlich unbedenklich ist, überprüft das Landesamt für Gesundheit und Soziales (LAGeSo) in regelmäßigen Untersuchungen alle zwei Wochen während der offiziellen Badesaison vom 15. Mai bis 15. September. Neben der Überwachung der gesundheitlich relevanten Parameter werden auch die Sichttiefe, die Beschaffenheit des Strandes, die Blaualgensituation und Gesundheitsbelastungen, die durch Blaualgen produziert werden, überwacht. Gegebenenfalls spricht das LAGeSo Warnhinweise für Badende aus. Die amtlichen Untersuchungen führt das Landeslabor Berlin-Brandenburg im Auftrag des LAGeSo durch.</p>
            <p>Sobald neue Untersuchungsergebnisse vorliegen, werden diese vom LAGeSo  auf seinen Badegewässerseiten im Internet veröffentlicht. Aktuelle Untersuchungsergebnisse finden Sie <a href="http://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/">hier</a>.</p>
            <p>An den Badestellen „Kleine Badewiese“ und „Grunewaldturm“ wird die Bewertung der Badegewässerqualität in der Badesaison 2018 erstmalig unter Berücksichtigung eines Frühwarnsystems durchgeführt. Dieses Frühwarnsystem wurde vom Kompetenzzentrum Wasser Berlin im Forschungsprojekt FLUSSHYGIENE entwickelt und liefert tagesaktuelle Prognosen für die Badegewässerqualität.</p>`
        },
        {
          head: 'Wie funktioniert das Frühwarnsystem?',
          body: `<p>Die Badegewässerqualität wird regelmäßig durch das Landesamt für Gesundheit und Soziales (LAGeSo) überwacht und zeigt die gute Qualität in den Berliner Badegewässer an den Seen oder an den Fließgewässern Havel und Spree.</p>
            <p>Einige Badestellen im nördlichen Bereich der Unterhavel werden, wenn es regnet, durch Mischwassereinleitungen aus dem Berliner Stadtgebiet und durch das Klärwerk Ruhleben beeinflusst. Dieses mit Abwasser vermischte Regenwasser fließt bei starkem Regen direkt aus der Kanalisation in die innerstädtischen Gewässer, etwa die Spree. Wie wir es von der Wettervorhersage kennen, regnet es örtlich und zeitlich sehr unterschiedlich. Auch die Fließgeschwindigkeit in Spree und Havel kann sich innerhalb kurzer Zeit stark verändern. Mit einer Verschlechterung der Badegewässerqualität ist dann zu rechnen, wenn es stark geregnet hat, Mischwasser übergelaufen und die Fließgeschwindigkeit im Fluss hoch ist. Dieser Zusammenhang wurde im Forschungsprojekt FLUSSHYGIENE über zwei Jahre sehr genau untersucht. Die Ergebnisse werden jetzt dazu eingesetzt, die Badegewässerqualität an den Badestellen „Kleine Badewiese“ und „Grunewaldturm“ vorherzusagen.</p>
            <p>Hierfür übermitteln die Berliner Wasserbetriebe (BWB) jeden Tag die gemessenen Daten zu Regen, Mischwasserüberläufen aus der Kanalisation sowie die Zu- und Ablaufdaten vom Klärwerk Ruhleben. Die Senatsverwaltung für Umwelt, Verkehr und Klimaschutz (SenUVK) übermittelt täglich Daten zur Fließgeschwindigkeit von Spree und Havel. Die Daten werden automatisch eingelesen, aufbereitet und ausgewertet. Am Ende steht jeden Morgen eine Prognose zur Wasserqualität, die am jeweiligen Tag zu erwarten ist, zur Verfügung.</p>
            <h4>Hinweise:</h4>
            <p>Das Baden in natürlichen Gewässern ist nie zu 100% risikofrei. Auch der Schiffs- und Bootsverkehr in der Unterhavel kann zu Belastungen führen, die durch das Modell nicht vorhergesagt werden.</p>`
        },
        {
          head:
            'Wo werden Wasserproben entnommen – in Randgebieten, Flachwasserzonen und tieferen Bereichen?',
          body: `<p>Ganz unterschiedlich, eher in tieferen Bereichen. Die genauen Probeentnahmestellen der Badegewässer können Sie sich im Internet in den Badegewässerprofilen auf den Infrastrukturkarten der Badestellen ansehen. (Zum Beispiel die Badegewässermessstelle der Badestelle Flussbad Gartenstraße finden Sie als gelben Punkt auf der <a href="https://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/badegewaesserprofile/artikel.339121.php">Karte</a>)</p>`
        },
        {
          head:
            'Was können Badegäste tun, um eine gute Qualität der Badegewässer zu schützen?',
          body: `<ul>
              <li>Alle Abfälle sorgfältig entsorgen und falls das vor Ort nicht möglich ist, sie mitnehmen</li>
              <li>Schilfgürtel nicht betreten</li>
              <li>Toiletten benutzen</li>
              <li>Hunde anleinen, nicht ins Wasser lassen und deren Kot einsammeln</li>
            </ul>`
        }
      ]
    },
    {
      group: 'Algen und Blaualgen',
      content: [
        {
          head: 'Algen und Blaualgen, was ist der Unterschied?',
          body: `<p>Als Algen werden pflanzliche Lebewesen bezeichnet, die im Wasser leben und Photosynthese betreiben. Sie sind in der Regel ungefährlich. Blaualgen dagegen heißen zwar Algen, sind aber eigentlich Bakterien - ihre korrekte Bezeichnung lautet Cyanobakterien. Diese Bakterien betreiben auch Photosynthese. Einzelne Blaualgen sind häufig mit dem bloßen Auge im Wasser nicht zu erkennen. Wenn sie sich jedoch z. B. nach längeren Hitzeperioden massenhaft vermehren, kann es zu grünen Trübungen des Wassers kommen, zu dichten Schlieren im Wasser oder zu Blaualgenmatten auf der Wasseroberfläche.</p>`
        },
        {
          head: 'Warum gibt es Algen und Blaualgen in den Berliner Badegewässern?',
          body: `<p>Fast alle Berliner Badestellen liegen an den rückgestauten Flussseen von Dahme, Spree und Havel oder an relativ flachen Landseen. Diese Gewässer sind aus unterschiedlichen Gründen nährstoffreich (z.B. Einträge aus der Landwirtschaft, Regenwassereinleitungen). Vor allem zu hohe Konzentrationen an Phosphor und Stickstoff fördern bei warmen Temperaturen ein stärkeres Wachstum von Algen im Wasser. Aufgrund der geringen Gewässertiefe und der langsamen Fließgeschwindigkeit können die Nährstoffe besonders gut von Algen genutzt werden.</p>`
        },
        {
          head: 'Stellen Blaualgen eine Gefahr für die menschliche Gesundheit dar?',
          body: `<p>Einige Blaualgenarten können Giftstoffe, sogenannte Cyanotoxine, ausscheiden. Dies passiert vor allem bei Massenentwicklungen. Cyanotoxine können je nach Art und Menge sehr unterschiedlich wirken. Einige führen zu Magen-Darm-Beschwerden oder Reizungen von Atemwegen, Haut und Schleimhäuten.</p>
            <p>In der Badesaison 2017 wurden außerdem geringe Mengen des Stoffs Anatoxin-a im Uferbereich des Tegeler Sees nachgewiesen. Dieser wird wahrscheinlich von einer aus tropischen Regionen zu uns eingewanderten Blaualge hergestellt und kann das Nervensystem schädigen. Typische Symptome für eine Anatoxin-a Vergiftung sind Schwindel, Lähmungserscheinungen, Krämpfe bis hin zum Atemstillstand. Dies gilt auch für Wild und Nutztiere, die Anatoxin-a über kontaminiertes Wasser oder Quellmoos zu sich nehmen.</p>
            <p>Eine Gesundheitsgefahr für Badende im Tegeler See besteht bei den bisher nachgewiesenen Mengen nicht. Aus Gründen des vorsorgenden Gesundheitsschutzes werden die in der Badesaison 2017 ausgesprochenen Hinweise in der Badesaison 2018 aufrechterhalten. Badende sollen Algen-/ Pflanzenansammlungen im Wasser und an Land meiden. Kleinkinder im Krabbelalter sollen den Badestellen fernbleiben, da sie aufgrund ihres Spielverhaltens und durch ihren häufigen Hand-Mund-Kontakt unbeabsichtigt größere Mengen an mit Cyanobakterien belastetem Sand und Wasser aufnehmen können.</p>`
        },
        {
          head: 'Wird das Badegewässer auf Giftstoffe untersucht?',
          body: `<p>Im Rahmen des vorbeugenden Gesundheitsschutzes werden die offiziellen Berliner Badestellen regelmäßig auf ihre hygienische Situation und auf das Vorliegen von Blaualgen und ihrer Giftstoffe im Landeslabor Berlin-Brandenburg untersucht. Die Situation im Gewässer kann sich kurzfristig ändern. Dies ist durch die Strömungsverhältnisse und insbesondere durch die aktuellen Windverhältnisse bedingt. Achten Sie deshalb auf Hinweise zum Algenvorkommen <a href="http://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/">hier</a>.</p>`
        }
      ]
    },
    {
      group: 'MRSA / Multiresistente Keime',
      content: [
        {
          head:
            'In niedersächsischen Badeseen wurden bei Wasserproben in diesem Jahr multiresistente Keime gefunden, wird auch in Berlin das Wasser auf diese Keime untersucht?',
          body: `<p>Die Wasserqualität in den Berliner Badegewässern wird zum Schutz der Badenden vom LAGeSo regelmäßig alle zwei Wochen überwacht. Dabei wird das Ausmaß der fäkalen Verunreinigung durch den Nachweis bestimmter Darmbakterien (E. coli und intestinale Enterokokken) festgestellt. </p>
            <p>Die Untersuchung von Badegewässern auf das Vorkommen multiresistenter Erreger ist nicht Bestandteil der EG-Badegewässerrichtlinie und der Berliner Badegewässerverordnung. Bislang gibt es in Berlin keinen Anlass, die Untersuchung von Badegewässern auf das Vorkommen multiresistenter Erreger zu erweitern. Das LAGeSo befindet sich allerdings in einem fachlichen Austausch mit Forschungseinrichtungen um aus deren Erkenntnissen ggf. Maßnahmen abzuleiten.</p>
            <p>Weitere Informationen finden Sie auf der <a href="https://www.umweltbundesamt.de/themen/wasser/schwimmen-baden/badegewaesser/faq-antibiotikaresistente-bakterien-in#textpart-7">Seite</a> des Umweltbundesamtes.</p>`
        }
      ]
    }
  ]

  export const printData = []
  data.forEach(d => {
    printData.push({
      head: d.group,
      group: true
    })
    d.content.forEach(c => {
      printData.push({ ...c, group: false })
    })
  })
</script>

<h2>FAQ zu den wichtigsten Themen</h2>
<ol id="faq-list">
  {#each printData as item, i}
    <li class:no-count={item.group}>
      {#if !item.group}
        <span
          on:click={() => {
            animateScroll.scrollTo({ element: '#faq-' + String((i + 1)), offset: -100 })}}
          >{item.head}</span
        >
      {:else}
        {item.head}
      {/if}
    </li>
  {/each}
</ol>

{#each printData as item, i}
  {#if !item.group}
    <section id="faq-{i + 1}">
      <h4>{item.head}</h4>
      {@html item.body}
    </section>
  {:else}
    <h3 class="faq-h">{item.head}</h3>
  {/if}
{/each}
