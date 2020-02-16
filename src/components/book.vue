<template>
<div class="page-book-details">
    <div style="padding:20px;">
        <h2 style="margin:0px; font-family:'Crimson Roman Bold';">{{ properties.title }}</h2>
        <small style="font-family:'Crimson Roman'; font-size:12px; color:#72789b;">Date Modified: Feb 11, 2020</small>
        <div class="row">
            <div class="col-12 col-lg-12 order-2 order-lg-1">
                <div style="padding:10px 0px;">
                    <span style="padding:3px 10px; font-size:12px; background:#e1e7fe; color:#9098c5; font-size:10px; font-family:'Crimson Roman Bold';">FANTASY</span>
                    <span style="padding:3px 10px; font-size:12px; background:#feedda; color:#d6a67f; font-size:10px; font-family:'Crimson Roman Bold';">SCI-FI</span>
                    <span style="padding:3px 10px; font-size:12px; background:#e1e7fe; color:#9098c5; font-size:10px; font-family:'Crimson Roman Bold';">ACTION</span>
                    <span style="padding:3px 10px; font-size:12px; background:#feedda; color:#d6a67f; font-size:10px; font-family:'Crimson Roman Bold';">COMEDY</span>
                </div>

                <div style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';">
                    <p>
                        William Shakespeare (bapt. 26 April 1564 – 23 April 1616)[a] was an English poet, playwright, and actor, widely regarded as the greatest writer in the English language
                        and the world's greatest dramatist.[2][3][4] He is often called England's national poet and the "Bard of Avon" (or simply "the Bard").[5][b] His extant works,
                        including collaborations, consist of some 39 plays,[c] 154 sonnets, two long narrative poems, and a few other verses, some of uncertain authorship. His plays have been
                        translated into every major living language and are performed more often than those of any other playwright.
                    </p>
                    <p>
                        Shakespeare was born and raised in Stratford-upon-Avon, Warwickshire. At the age of 18, he married Anne Hathaway, with whom he had three children: Susanna and twins Hamnet and Judith.
                        Sometime between 1585 and 1592, he began a successful career in London as an actor, writer, and part-owner of a playing company called the Lord Chamberlain's Men,
                        later known as the King's Men. At age 49 (around 1613), he appears to have retired to Stratford, where he died three years later. Few records of Shakespeare's private life survive;
                        this has stimulated considerable speculation about such matters as his physical appearance, his sexuality, his religious beliefs, and whether the works attributed to him were written
                        by others.
                    </p>
                    <p>
                        William Shakespeare (bapt. 26 April 1564 – 23 April 1616)[a] was an English poet, playwright, and actor, widely regarded as the greatest writer in the English language
                        and the world's greatest dramatist.[2][3][4] He is often called England's national poet and the "Bard of Avon" (or simply "the Bard").[5][b] His extant works,
                        including collaborations, consist of some 39 plays,[c] 154 sonnets, two long narrative poems, and a few other verses, some of uncertain authorship. His plays have been
                        translated into every major living language and are performed more often than those of any other playwright.
                    </p>
                </div>
            </div>
            <div style="display:none;" class="col-12 col-lg-3 order-1 order-lg-2">
                <div class="book-stats">
                    <strong class="heading">Book Statistics</strong>
                    <ul class="list-group">
                        <li class="list-group-item"><span class="badge badge-success">12</span> &nbsp; <strong>Total Chapters</strong></li>
                        <li class="list-group-item"><span class="badge badge-success">38</span> &nbsp; <strong>Total Scenes</strong></li>
                        <li class="list-group-item"><span class="badge badge-success">21</span> &nbsp; <strong>Total Locations</strong></li>
                        <li class="list-group-item"><span class="badge badge-success">89</span> &nbsp; <strong>Total Items</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'book-details',
  props: ['properties'],
  data: function () {
    return {
    }
  },
  methods: {
  },
  mounted () {
    // var scope = this
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-stats { padding-left:30px; }
.book-stats .heading { font-family:'Gotham Bold'; }
.book-stats ul { margin-top:5px; }
@media only screen and (max-width: 968px) {
  .book-stats { display:none; }
}
</style>
