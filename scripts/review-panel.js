/* 比較検証用パネル（_review 専用・本番には入れない）
   右下のツマミで開閉。選択は localStorage に保存する。 */
(function () {
  const OPTS = {
    band: {
      label: 'self time 3枚組',
      items: [
        ['A', 'A案 ソファ＝左のワイド枠（推奨）'],
        ['B', 'B案 ソファ＝中央の縦枠'],
        ['now', '現状（ソファなし）'],
      ],
    },
    btn: {
      label: '予約ボタン',
      items: [
        ['a', 'A 現状（白地・線）'],
        ['b', 'B 墨ベタ'],
        ['c', 'C ブランドカラー（オリーブ）'],
        ['d', 'D ブランドカラー（ベージュ）'],
        ['e', 'E 白地のまま大きく'],
      ],
    },
  };
  const DEF = { band: 'A', btn: 'a' };
  const state = Object.assign({}, DEF, JSON.parse(localStorage.getItem('selfReview') || '{}'));

  const BAND = {
    A:   [['wide', 'selftime-sofa'], ['tall', '4444'], ['tall', '4494']],
    B:   [['wide', '0087'], ['tall', 'selftime-sofa'], ['tall', '4494']],
    now: [['wide', '0087'], ['tall', '4444'], ['tall', '4494']],
  };

  function apply() {
    // self time 3枚組
    const figs = document.querySelectorAll('.rv-time__band figure');
    (BAND[state.band] || BAND.A).forEach(([kind, name], i) => {
      const f = figs[i];
      if (!f) return;
      f.className = 'rv-time__b-' + kind;
      f.querySelector('img').src = './images/web/' + name + '.webp';
    });
    // 予約ボタン
    const btn = document.querySelector('.rv-float');
    if (btn) btn.className = 'rv-float' + (btn.classList.contains('is-shown') ? ' is-shown' : '') + ' v-' + state.btn;
    localStorage.setItem('selfReview', JSON.stringify(state));
  }

  const box = document.createElement('div');
  box.id = 'rvw';
  box.innerHTML =
    '<button id="rvw-t">検証パネル</button><div id="rvw-b">' +
    Object.entries(OPTS).map(([k, g]) =>
      '<p>' + g.label + '</p>' + g.items.map(([v, t]) =>
        '<label><input type="radio" name="' + k + '" value="' + v + '"' +
        (state[k] === v ? ' checked' : '') + '>' + t + '</label>').join('')
    ).join('<hr>') +
    '<hr><button id="rvw-r">リセット</button></div>';
  document.body.appendChild(box);

  box.addEventListener('change', e => {
    state[e.target.name] = e.target.value;
    apply();
    // ボタンの見た目を確認しやすいよう、下までスクロールしていない時は表示だけ出す
    const btn = document.querySelector('.rv-float');
    if (e.target.name === 'btn' && btn) btn.classList.add('is-shown');
  });
  document.getElementById('rvw-t').onclick = () => box.classList.toggle('open');
  document.getElementById('rvw-r').onclick = () => { localStorage.removeItem('selfReview'); location.reload(); };
  box.classList.add('open');
  apply();
})();
