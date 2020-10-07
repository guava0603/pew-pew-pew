# Pew Pew Pew!

## Software Studio 2019 Spring Assignment 02 Raiden

| Component                   | Score | Y/N |
* Basic Components
| Complete game process       |  15%  |  Y  |
[在一開始進入畫面時，首先會進入遊戲首頁，首頁除了背景外就有一隻一直在飛的主角，不重要但是還滿可愛的。點擊空白鍵會進入遊戲。]
[遊戲會一直持續直到角色死亡，而後會進入結算頁面展示出分數。此時右下角的分數牌下有兩隻小主角，點擊左方那隻（hover的時候會動ㄉ）會重新來一局，右方的那隻會回到首頁。]

| Basic rules                 |  20%  |  Y  |
[遊戲的操作方式是上下左右鍵控制移動、空白鍵射擊可以每4秒射出子彈、C鍵大絕招可以每10秒環狀射出子彈]
[地圖是橫向移動的]
[敵人會從右方入場，入場後除非被射死否則不會離開只會以固定速度在場內來回上下移動，敵人能夠與主角重疊，但一旦主角被射到就會扣1顆心。]

| Jucify mechanisms           |  15%  |  Y  |
[怪物有分為0號與1號兩種，1移動速度略快於0，殺死能拿到的分數也是2倍。一開始在level_1時只會出現0，每200分會上升一個level，怪物出現頻率會比先前快出0.1秒（但不會低於0.2秒）]
[出現的可以拾取的特殊物品，加快速度物品一直都有、自動瞄準物品和穿透物品在level_2後才會出現、小幫手物品在level_3後才會出現、回血物品在level_5後才會出現]
[角色每10秒就能使用一次大絕招，大絕招是會射出放射狀的一整圈子彈]

| Animations                  |  10%  |  Y  |
[主角和敵人在移動時都有各自的飛行動畫，主角射擊時也有另外的動畫。我覺得他滿可愛的。]

| Particle Systems            |  10%  |  Y  |
[在雙方被射擊到時都會有特效出現]

| Sound effects               |   5%  |  Y  |
[整個遊戲本身都有播放背景音樂，這個音樂是會無限loop的]
[剛進入一場新遊戲時會出現鳥叫聲。]
[主角被打到的時候會有鳥的慘叫聲（也沒有太慘）。]

| UI                          |   5%  |  Y  |
[左上角有顯示分數]
[分數下方會有大絕招的提示，如果現在不能使用也會提示要多久才能繼續使用，]
[右上角愛心數量代表目前的主角生命，每被射到一次就會扣1]
[右下角的捲軸按了會暫停遊戲，再按一次會繼續遊戲]
[左下角則是音量相關的圖，點擊喇叭圖案可以開聲音以及靜音，右邊的每個槓槓都是現在音量，亮的除以總共的數量就是目前音量大小，點擊每個槓槓就會把現在的音量調到那個位置，如果靜音狀態調整的話就是等到開聲音了才會感受到變化這樣子]

| Leaderboard                 |   5%  |  N  |
[忘記做ㄌQQ]

| Appearance                  |   5%  |  -  |
[我覺得我的圖滿可愛的還有和背景配過，然後結尾畫面的圖是自己做的，希望可以拿到分數QQ]

* Bonus
| Multi-player game | 20% |
| On-line                     |  15%  |  N  |
| Off-line                    |   5%  |  N  |
[這邊都沒寫，有點冗。]

| Enhanced items    | 15% |
| Bullet automatic aiming     |   5%  |  Y  |
[吃到「十字弓」圖案的自動瞄準物品就會啟動，在啟動的這3秒中，射出的所有子彈都會追過去去瞄準其中一個敵人，直到對方死亡後他們會再很違反重力的一起去瞄準下一個敵人。]

| Unique bullet               |   5%  |  Y  |
[吃到「寶劍」圖案的穿透物品就會啟動，在啟動的這8秒內，所有子彈穿透敵人後都還會在，不會直接消失。]

| Little helper               |   5%  |  Y  |
[吃到「拳頭」圖案的小幫手物品就會啟動，在啟動的這10秒鐘會出現一個長一樣但比較大的小幫手，他會擋在主角前面幫忙擋子彈，所有射到他的子彈都會消失，也不會有特效。]

| Boss                        |   5%  |    |
| Addition |
[背景是做成有深度的背景，前方跑的速度比較快所以有立體感]
[吃到「羽毛」圖案的加速物品就會啟動，在啟動的這5秒移動速度會變為原先的2倍]
[吃到「愛心」圖案的回血物品就會補1顆心]

Demo link on gitlab: https://106062226.gitlab.io/assignment_02/
