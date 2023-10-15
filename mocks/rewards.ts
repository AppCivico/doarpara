export interface CampaignItem {
  id: number;
  minimum_reward: number;
  title: string;
  picture: string;
  description: string;
  supporters: number;
}

const campaignData: CampaignItem[] = [
  {
    id: 1,
    minimum_reward: 10,
    title: 'Kit de brindes Espuma',
    picture: '/assets/img/brindes-espuma.png',
    description: `<p>
          Como agradecimento pela sua incrível doação, você receberá um kit de
          brindes Espuma para guardar ou presentear um amigo ou familiar. Além
          disso, você...
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit aenean vel,
          fusce lacus mi blandit cubilia porta massa vitae faucibus, cras quis
          eleifend donec nec curabitur primis fermentum. Felis tempor mollis
          ultrices luctus aptent malesuada placerat ut maecenas ac, tincidunt
          pharetra per id vulputate nisi donec lobortis nam curabitur, cum quam
          sodales elementum ornare varius duis penatibus vel. Vehicula convallis
          arcu fringilla imperdiet bibendum sed tincidunt in lectus tempus odio,
          vulputate dictum nec turpis accumsan proin molestie mattis venenatis
          tortor augue, per potenti taciti nunc habitasse curabitur tellus eros
          a pellentesque.
        </p>
        <p>
          Urna platea id aliquet fringilla penatibus, ridiculus lectus
          parturient malesuada. Taciti et class mattis viverra accumsan litora
          lacus cum sed, rutrum posuere semper quis aptent risus lacinia gravida
          facilisis a, nec suspendisse vulputate sociosqu sem convallis eget
          magna. Aliquet augue magnis facilisis sed libero vehicula dapibus diam
          mauris, sodales eros curae vivamus risus cum curabitur habitasse
          litora, condimentum lectus nam dignissim lacus non pharetra pretium.
        </p>`,
    supporters: 215,
  },
  {
    id: 2,
    minimum_reward: 60,
    title: 'Kit banho + guloseimas',
    picture: '/assets/img/banho+guloseimas.png',
    description: `<p>
          Muito obrigado! Pela sua doação, você será incluído em nosso muro da
          fama de Espuma em nosso site, ganhe um pano de prato edição limitada e
          uma...
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Adipiscing
          commodo elit at imperdiet dui accumsan sit amet nulla. Laoreet non
          curabitur gravida arcu ac tortor dignissim convallis. Mattis molestie
          a iaculis at erat pellentesque adipiscing commodo. Viverra justo nec
          ultrices dui sapien eget. Ultrices dui sapien eget mi proin. Dolor sed
          viverra ipsum nunc aliquet. Ut etiam sit amet nisl purus in mollis
          nunc sed. Ipsum dolor sit amet consectetur adipiscing elit ut aliquam
          purus. Adipiscing enim eu turpis egestas pretium aenean. Mauris nunc
          congue nisi vitae suscipit tellus mauris a diam. Quis varius quam
          quisque id diam vel quam elementum. Lorem sed risus ultricies
          tristique nulla. Interdum consectetur libero id faucibus nisl
          tincidunt. Arcu vitae elementum curabitur vitae. Urna neque viverra
          justo nec ultrices dui sapien. Arcu ac tortor dignissim convallis. At
          risus viverra adipiscing at in tellus. Elementum curabitur vitae nunc
          sed velit dignissim sodales ut. Vitae suscipit tellus mauris a diam
          maecenas sed enim ut.
        </p>
        <p>
          Aenean sed adipiscing diam donec adipiscing tristique risus nec. Dui
          ut ornare lectus sit amet. Integer enim neque volutpat ac. Turpis
          egestas integer eget aliquet. Lectus quam id leo in vitae. Venenatis a
          condimentum vitae sapien pellentesque habitant morbi. Lacus sed
          viverra tellus in hac. Vel quam elementum pulvinar etiam non.
          Porttitor lacus luctus accumsan tortor posuere. In pellentesque massa
          placerat duis ultricies lacus sed turpis. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam quis. Nec feugiat in
          fermentum posuere urna nec tincidunt praesent. Id donec ultrices
          tincidunt arcu non sodales neque sodales. Quis ipsum suspendisse
          ultrices gravida dictum fusce ut placerat orci. Lacinia quis vel eros
          donec ac odio tempor. Vestibulum rhoncus est pellentesque elit
          ullamcorper. Dignissim suspendisse in est ante in nibh mauris.
          Curabitur gravida arcu ac tortor. Scelerisque in dictum non
          consectetur a erat.
        </p>
        <p>
          In nibh mauris cursus mattis molestie. Blandit cursus risus at
          ultrices mi. Tempor commodo ullamcorper a lacus. Ullamcorper a lacus
          vestibulum sed arcu non odio euismod. A iaculis at erat pellentesque.
          At quis risus sed vulputate odio. Velit sed ullamcorper morbi
          tincidunt. Condimentum vitae sapien pellentesque habitant morbi
          tristique senectus et. Nunc sed blandit libero volutpat sed cras
          ornare arcu. Etiam tempor orci eu lobortis elementum nibh tellus
          molestie nunc. Vulputate mi sit amet mauris commodo quis imperdiet.
          Facilisis volutpat est velit egestas. Convallis a cras semper auctor
          neque vitae tempus quam. A diam sollicitudin tempor id.
        </p>
        <p>
          Massa eget egestas purus viverra accumsan in. Iaculis eu non diam
          phasellus vestibulum. Varius duis at consectetur lorem donec massa
          sapien faucibus. Magna ac placerat vestibulum lectus mauris ultrices
          eros. Malesuada bibendum arcu vitae elementum curabitur vitae nunc
          sed. Non blandit massa enim nec dui nunc mattis. Nulla pharetra diam
          sit amet nisl suscipit adipiscing. Enim diam vulputate ut pharetra sit
          amet aliquam. Sollicitudin tempor id eu nisl nunc mi. Vitae congue eu
          consequat ac felis donec. Luctus accumsan tortor posuere ac.
        </p>
        <p>
          Nisl nunc mi ipsum faucibus. Habitasse platea dictumst quisque
          sagittis purus sit amet. Ultrices gravida dictum fusce ut placerat
          orci. Pretium fusce id velit ut tortor. Sed cras ornare arcu dui.
          Neque egestas congue quisque egestas diam. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Rhoncus est pellentesque elit
          ullamcorper dignissim. Iaculis urna id volutpat lacus. Ullamcorper
          dignissim cras tincidunt lobortis feugiat vivamus at. Consectetur
          adipiscing elit ut aliquam purus sit amet luctus venenatis. Et
          sollicitudin ac orci phasellus egestas tellus rutrum tellus. Nec
          feugiat in fermentum posuere urna nec tincidunt praesent. Ut tristique
          et egestas quis ipsum suspendisse ultrices gravida. Massa placerat
          duis ultricies lacus. Semper risus in hendrerit gravida rutrum
          quisque. Morbi non arcu risus quis. Ipsum dolor sit amet consectetur.
          Maecenas sed enim ut sem.
        </p>`,
    supporters: 48,
  },
  {
    id: 3,
    minimum_reward: 110,
    title: 'Toalha de banho bordada',
    picture: '/assets/img/toalha-bordada.png',
    description: `<p>
          UAU, obrigado! Você receberá uma toalha de banho impressa com a marca
          da campanha (edição limitada) com sua doação, além de se tornar...
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Dignissim
          enim sit amet venenatis urna cursus eget nunc. Vitae auctor eu augue
          ut lectus. Feugiat sed lectus vestibulum mattis ullamcorper velit sed
          ullamcorper morbi. Quis enim lobortis scelerisque fermentum dui
          faucibus in ornare. Tempor nec feugiat nisl pretium. Vitae congue eu
          consequat ac felis donec. Morbi tincidunt augue interdum velit euismod
          in. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum
          tellus. Leo duis ut diam quam nulla porttitor massa id neque. Tempor
          orci dapibus ultrices in iaculis nunc sed augue. Sed egestas egestas
          fringilla phasellus faucibus scelerisque eleifend. Convallis aenean et
          tortor at risus viverra adipiscing at.
        </p>
        <p>
          Ultrices vitae auctor eu augue ut lectus arcu. Fermentum dui faucibus
          in ornare. Arcu felis bibendum ut tristique et egestas quis. Egestas
          maecenas pharetra convallis posuere morbi leo urna molestie. Nullam
          eget felis eget nunc. Volutpat maecenas volutpat blandit aliquam. Eget
          mi proin sed libero. Facilisis sed odio morbi quis commodo odio aenean
          sed. Porttitor rhoncus dolor purus non enim praesent elementum. Id
          semper risus in hendrerit gravida. Ullamcorper sit amet risus nullam
          eget felis eget. Duis ut diam quam nulla porttitor. Augue interdum
          velit euismod in. Sit amet purus gravida quis blandit turpis cursus in
          hac. Nulla aliquet enim tortor at. Mauris nunc congue nisi vitae.
          Aliquet risus feugiat in ante metus dictum at tempor. Volutpat commodo
          sed egestas egestas fringilla phasellus faucibus. Purus ut faucibus
          pulvinar elementum integer enim. Sed odio morbi quis commodo odio
          aenean sed adipiscing.
        </p>`,
    supporters: 0,
  },
  {
    id: 4,
    minimum_reward: 60,
    title: 'Kit banho + guloseimas',
    picture: '/assets/img/banho+guloseimas.png',
    description: `<p>
          Massa eget egestas purus viverra accumsan in. Iaculis eu non diam
          phasellus vestibulum. Varius duis at consectetur lorem donec massa
          sapien faucibus. Magna ac placerat vestibulum lectus mauris ultrices
          eros. Malesuada bibendum arcu vitae elementum curabitur vitae nunc
          sed. Non blandit massa enim nec dui nunc mattis. Nulla pharetra diam
          sit amet nisl suscipit adipiscing. Enim diam vulputate ut pharetra sit
          amet aliquam. Sollicitudin tempor id eu nisl nunc mi. Vitae congue eu
          consequat ac felis donec. Luctus accumsan tortor posuere ac.
        </p>
        <p>
          Nisl nunc mi ipsum faucibus. Habitasse platea dictumst quisque
          sagittis purus sit amet. Ultrices gravida dictum fusce ut placerat
          orci. Pretium fusce id velit ut tortor. Sed cras ornare arcu dui.
          Neque egestas congue quisque egestas diam. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Rhoncus est pellentesque elit
          ullamcorper dignissim. Iaculis urna id volutpat lacus. Ullamcorper
          dignissim cras tincidunt lobortis feugiat vivamus at. Consectetur
          adipiscing elit ut aliquam purus sit amet luctus venenatis. Et
          sollicitudin ac orci phasellus egestas tellus rutrum tellus. Nec
          feugiat in fermentum posuere urna nec tincidunt praesent. Ut tristique
          et egestas quis ipsum suspendisse ultrices gravida. Massa placerat
          duis ultricies lacus. Semper risus in hendrerit gravida rutrum
          quisque. Morbi non arcu risus quis. Ipsum dolor sit amet consectetur.
          Maecenas sed enim ut sem.
        </p>`,
    supporters: 1,
  },
  {
    id: 5,
    minimum_reward: 110,
    title: 'Toalha de banho bordada',
    picture: '/assets/img/toalha-bordada.png',
    description: `<p>
          Ultrices vitae auctor eu augue ut lectus arcu. Fermentum dui faucibus
          in ornare. Arcu felis bibendum ut tristique et egestas quis. Egestas
          maecenas pharetra convallis posuere morbi leo urna molestie. Nullam
          eget felis eget nunc. Volutpat maecenas volutpat blandit aliquam. Eget
          mi proin sed libero. Facilisis sed odio morbi quis commodo odio aenean
          sed. Porttitor rhoncus dolor purus non enim praesent elementum. Id
          semper risus in hendrerit gravida. Ullamcorper sit amet risus nullam
          eget felis eget. Duis ut diam quam nulla porttitor. Augue interdum
          velit euismod in. Sit amet purus gravida quis blandit turpis cursus in
          hac. Nulla aliquet enim tortor at. Mauris nunc congue nisi vitae.
          Aliquet risus feugiat in ante metus dictum at tempor. Volutpat commodo
          sed egestas egestas fringilla phasellus faucibus. Purus ut faucibus
          pulvinar elementum integer enim. Sed odio morbi quis commodo odio
          aenean sed adipiscing.
        </p>`,
    supporters: 48275758,
  },
  {
    id: 6,
    minimum_reward: 627870,
    title: 'Kit banho + guloseimas',
    picture: '/assets/img/banho+guloseimas.png',
    description: `<p>
          In nibh mauris cursus mattis molestie. Blandit cursus risus at
          ultrices mi. Tempor commodo ullamcorper a lacus. Ullamcorper a lacus
          vestibulum sed arcu non odio euismod. A iaculis at erat pellentesque.
          At quis risus sed vulputate odio. Velit sed ullamcorper morbi
          tincidunt. Condimentum vitae sapien pellentesque habitant morbi
          tristique senectus et. Nunc sed blandit libero volutpat sed cras
          ornare arcu. Etiam tempor orci eu lobortis elementum nibh tellus
          molestie nunc. Vulputate mi sit amet mauris commodo quis imperdiet.
          Facilisis volutpat est velit egestas. Convallis a cras semper auctor
          neque vitae tempus quam. A diam sollicitudin tempor id.
        </p>
        <p>
          Massa eget egestas purus viverra accumsan in. Iaculis eu non diam
          phasellus vestibulum. Varius duis at consectetur lorem donec massa
          sapien faucibus. Magna ac placerat vestibulum lectus mauris ultrices
          eros. Malesuada bibendum arcu vitae elementum curabitur vitae nunc
          sed. Non blandit massa enim nec dui nunc mattis. Nulla pharetra diam
          sit amet nisl suscipit adipiscing. Enim diam vulputate ut pharetra sit
          amet aliquam. Sollicitudin tempor id eu nisl nunc mi. Vitae congue eu
          consequat ac felis donec. Luctus accumsan tortor posuere ac.
        </p>
        <p>
          Nisl nunc mi ipsum faucibus. Habitasse platea dictumst quisque
          sagittis purus sit amet. Ultrices gravida dictum fusce ut placerat
          orci. Pretium fusce id velit ut tortor. Sed cras ornare arcu dui.
          Neque egestas congue quisque egestas diam. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Rhoncus est pellentesque elit
          ullamcorper dignissim. Iaculis urna id volutpat lacus. Ullamcorper
          dignissim cras tincidunt lobortis feugiat vivamus at. Consectetur
          adipiscing elit ut aliquam purus sit amet luctus venenatis. Et
          sollicitudin ac orci phasellus egestas tellus rutrum tellus. Nec
          feugiat in fermentum posuere urna nec tincidunt praesent. Ut tristique
          et egestas quis ipsum suspendisse ultrices gravida. Massa placerat
          duis ultricies lacus. Semper risus in hendrerit gravida rutrum
          quisque. Morbi non arcu risus quis. Ipsum dolor sit amet consectetur.
          Maecenas sed enim ut sem.
        </p>`,
    supporters: 87867848,
  },
  {
    id: 7,
    minimum_reward: 110,
    title: 'Toalha de banho bordada',
    picture: '/assets/img/toalha-bordada.png',
    description: `<p>
          Ultrices vitae auctor eu augue ut lectus arcu. Fermentum dui faucibus
          in ornare. Arcu felis bibendum ut tristique et egestas quis. Egestas
          maecenas pharetra convallis posuere morbi leo urna molestie. Nullam
          eget felis eget nunc. Volutpat maecenas volutpat blandit aliquam. Eget
          mi proin sed libero. Facilisis sed odio morbi quis commodo odio aenean
          sed. Porttitor rhoncus dolor purus non enim praesent elementum. Id
          semper risus in hendrerit gravida. Ullamcorper sit amet risus nullam
          eget felis eget. Duis ut diam quam nulla porttitor. Augue interdum
          velit euismod in. Sit amet purus gravida quis blandit turpis cursus in
          hac. Nulla aliquet enim tortor at. Mauris nunc congue nisi vitae.
          Aliquet risus feugiat in ante metus dictum at tempor. Volutpat commodo
          sed egestas egestas fringilla phasellus faucibus. Purus ut faucibus
          pulvinar elementum integer enim. Sed odio morbi quis commodo odio
          aenean sed adipiscing.
        </p>`,
    supporters: 44558,
  },
  {
    id: 8,
    minimum_reward: 60,
    title: 'Kit banho + guloseimas',
    picture: '/assets/img/banho+guloseimas.png',
    description: `<p>
          In nibh mauris cursus mattis molestie. Blandit cursus risus at
          ultrices mi. Tempor commodo ullamcorper a lacus. Ullamcorper a lacus
          vestibulum sed arcu non odio euismod. A iaculis at erat pellentesque.
          At quis risus sed vulputate odio. Velit sed ullamcorper morbi
          tincidunt. Condimentum vitae sapien pellentesque habitant morbi
          tristique senectus et. Nunc sed blandit libero volutpat sed cras
          ornare arcu. Etiam tempor orci eu lobortis elementum nibh tellus
          molestie nunc. Vulputate mi sit amet mauris commodo quis imperdiet.
          Facilisis volutpat est velit egestas. Convallis a cras semper auctor
          neque vitae tempus quam. A diam sollicitudin tempor id.
        </p>
        <p>
          Massa eget egestas purus viverra accumsan in. Iaculis eu non diam
          phasellus vestibulum. Varius duis at consectetur lorem donec massa
          sapien faucibus. Magna ac placerat vestibulum lectus mauris ultrices
          eros. Malesuada bibendum arcu vitae elementum curabitur vitae nunc
          sed. Non blandit massa enim nec dui nunc mattis. Nulla pharetra diam
          sit amet nisl suscipit adipiscing. Enim diam vulputate ut pharetra sit
          amet aliquam. Sollicitudin tempor id eu nisl nunc mi. Vitae congue eu
          consequat ac felis donec. Luctus accumsan tortor posuere ac.
        </p>
        <p>
          Nisl nunc mi ipsum faucibus. Habitasse platea dictumst quisque
          sagittis purus sit amet. Ultrices gravida dictum fusce ut placerat
          orci. Pretium fusce id velit ut tortor. Sed cras ornare arcu dui.
          Neque egestas congue quisque egestas diam. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Rhoncus est pellentesque elit
          ullamcorper dignissim. Iaculis urna id volutpat lacus. Ullamcorper
          dignissim cras tincidunt lobortis feugiat vivamus at. Consectetur
          adipiscing elit ut aliquam purus sit amet luctus venenatis. Et
          sollicitudin ac orci phasellus egestas tellus rutrum tellus. Nec
          feugiat in fermentum posuere urna nec tincidunt praesent. Ut tristique
          et egestas quis ipsum suspendisse ultrices gravida. Massa placerat
          duis ultricies lacus. Semper risus in hendrerit gravida rutrum
          quisque. Morbi non arcu risus quis. Ipsum dolor sit amet consectetur.
          Maecenas sed enim ut sem.
        </p>`,
    supporters: 9938348,
  },
];

export default campaignData;
