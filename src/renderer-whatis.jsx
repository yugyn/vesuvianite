import 'bootstrap/dist/css/bootstrap.css'
import React, {Component} from 'react';

import {createRoot} from 'react-dom/client';
import Navbar from './components/Navbar';

class Whatis extends Component {

  render() {

    return (
      <>
        <div className='container'>
          <h1>Cos'è Vesuvianite</h1>
          <hr/>
<p>
Partiamo dal nome.
<br/>
Indubbiamente lo <i>spinello</i> è uno dei minerali più affascinanti del Somma-Vesuvio.
<br/>
Ma registrare un dominio "spinello.it"... non era il caso!
<br/>
Quindi, quale minerale può meglio rappresentare quest'area che valta oltre 300 specie diverse?
<br/>
Beh, la <i>vesuvianite</i> è senza dubbio il miglior candidato, sia bellezza del mineral, sia per l'associazione con la zona da cui tutto ha inizio...
</p>

<p>
<b>Vesuvianite</b> è un progetto che ha lo scopo di organizzare al meglio le informazioni ad oggi note sui minerali del <b>Somma-Vesuvio</b>, dei <b>Campi Flegrei</b> e della Campania in generale.
</p>

<p>
L’idea nasce da un progetto studio.
<br/>
Un attacco di nostalgia, la voglia di riprendere uno dei linguaggi di programmazione web per eccellenza e la voglia di realizzare un portale senza usare framework, il solo e sano linguaggio PHP, nudo e crudo.
<br/>
La necessità e la voglia di mettere assieme e, nel possibile, ordinare, tutte le informazioni reperite in letteratura e frutto dell’esperienza dei gradi collezionisti dei minerali nostrani.
</p>
<p>
Eh si, da un po' di tempo che ho il piacere di frequentare esperti di questa zona che vantano una collezione seconda solo a quella del Museo di Napoli (forse!) e di acquisire nozioni dalla loro esperienza che in alcuni casi copre un buon mezzo secolo di passione!
Persone a dir poco squisite che hanno fatto della passione per i minerali del Somma-Vesuvio una ragione di vita.
<br/>
La loro passione è stata così travolgente da farmi mettere da parte tutti gli altri hobby che sono solito coltivare e dedicarmi anima e corpo alla mineralogia della nostra terra.
<br/>
E in tutta onestà, non ne sono minimamente pentito, anzi, solo dispiaciuto di non averlo fatto prima…
</p>
<p>
E quindi eccoci qua, con questo portale che spera essere di aiuto a chi vorrà imbarcarsi nella meravigliosa avventura della mineralogia Vesuviana, dei Campi Flegrei e della Campania in generale.
</p>
<p>
Buona consultazione!
</p>

<p>&nbsp;</p>

<figure class="text-end">
<figcaption class="blockquote-footer">
<cite>
Eugenio Vespiano
</cite>
</figcaption>
</figure>
        </div>
      </>
    );

  }

}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Whatis/>);
