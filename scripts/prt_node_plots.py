"""Publication plots of descriptive PRT counts; no inferred population error rates."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

BLUE="#28678E"
PALE="#C8DCE9"
ORANGE="#B9662A"
TEAL="#5B8480"
INK="#24394A"

def save(fig, path):
    fig.savefig(path.with_suffix(".svg"),facecolor="white",bbox_inches="tight")
    fig.savefig(path.with_suffix(".png"),facecolor="white",bbox_inches="tight",dpi=180)
    plt.close(fig)

def make_plots(s, data):
    with plt.rc_context({"font.family":"DejaVu Sans", "font.size":10,
                         "axes.spines.top":False,"axes.spines.right":False,
                         "axes.edgecolor":"#C9D3DA", "axes.labelcolor":INK,
                         "xtick.color":INK,"ytick.color":INK,
                         "svg.fonttype":"path"}):
        bands=s["node_bands"]
        y=list(range(len(bands)))
        fig,(left,right)=plt.subplots(1,2,figsize=(10.6,4.7),sharey=True,
                                     gridspec_kw={"width_ratios":[1,1.35]})
        fig.subplots_adjust(left=.10,right=.98,bottom=.19,top=.73,wspace=.23)
        fig.suptitle("Recorded PRT defects by tree size",x=.02,y=.98,ha="left",fontsize=17,fontweight="bold",color=INK)
        fig.text(.02,.88,"All 5,489 standalone PRTs; confirmed direct defects only",fontsize=11,color="#526673")
        left.barh(y,[b["prts"] for b in bands],color=PALE,height=.6)
        left.set_yticks(y,[f"{b['label']} node"+("s" if b['label']!="1" else "") for b in bands])
        left.invert_yaxis();left.set_xlim(0,5100)
        left.set_title("How many trees are available?",loc="left",fontsize=11,pad=12,color=INK)
        left.set_xlabel("Number of PRTs")
        left.xaxis.set_major_formatter(FuncFormatter(lambda v,_:f"{int(v):,}"))
        for yy,b in zip(y,bands):left.text(b["prts"]+80,yy,f"{b['prts']:,}",va="center",color=INK)
        right.barh(y,[b["direct_percent"] or 0 for b in bands],color=BLUE,height=.6)
        right.set_xlim(0,10)
        right.set_title("What proportion has a recorded direct defect?",loc="left",fontsize=11,pad=12,color=INK)
        right.set_xlabel("Percentage of PRTs (%)")
        right.set_xticks([0,2,4,6,8,10]);right.tick_params(axis="y",left=False)
        for yy,b in zip(y,bands):
            right.text((b["direct_percent"] or 0)+.18,yy,
                       f"{b['direct_percent']:.2f}%  ({b['direct_defects']}/{b['prts']:,})",
                       va="center",fontsize=10,color=INK)
        for ax in (left,right):
            ax.set_axisbelow(True);ax.grid(axis="x",color="#E5EBEF",linewidth=.7)
            ax.spines["left"].set_visible(False);ax.tick_params(axis="y",length=0)
        fig.text(.02,.045,"Unflagged trees are undecided. Unequal review depth and task complexity limit interpretation; no causal effect is estimated.",fontsize=9,color="#526673")
        save(fig,data/"prt-node-bands")

        ladder=s["cumulative_ladder"]
        x=[r["minimum_nodes"] for r in ladder]
        fig,ax=plt.subplots(figsize=(10.6,5.1))
        fig.subplots_adjust(left=.09,right=.98,bottom=.21,top=.77)
        fig.suptitle("The node-count ladder becomes sparse quickly",x=.02,y=.98,ha="left",fontsize=17,fontweight="bold",color=INK)
        fig.text(.02,.88,"Each step keeps trees with at least that many nodes; groups overlap",fontsize=11,color="#526673")
        ax.axvspan(6.5,max(x)+.3,color="#F1F3F5",zorder=0)
        ax.step(x,[r["prts"] for r in ladder],where="post",color=BLUE,linewidth=2,marker="o",markersize=4,label="PRTs remaining")
        ax.step(x,[r["questions"] for r in ladder],where="post",color=TEAL,linewidth=1.7,linestyle="--",marker="s",markersize=3,label="Distinct questions represented")
        ax.step(x,[r["direct_defects"] for r in ladder],where="post",color=ORANGE,linewidth=2,marker="o",markersize=4,label="PRTs with a recorded direct defect")
        ax.set_yscale("log");ax.set_ylim(.65,16000);ax.set_xlim(.8,max(x)+.3)
        ax.set_yticks([1,10,100,1000,10000]);ax.yaxis.set_major_formatter(FuncFormatter(lambda v,_:f"{int(v):,}"))
        ax.set_xticks(x);ax.set_xlabel("Minimum number of nodes per PRT");ax.set_ylabel("Count (logarithmic scale)")
        ax.grid(axis="y",which="major",color="#E1E7EC",linewidth=.7);ax.set_axisbelow(True)
        ax.legend(loc="upper right",frameon=False,fontsize=9)
        ax.text(7.1,170,"At least 7 nodes:\nonly 13 PRTs remain",color="#526673",fontsize=10)
        ax.annotate("15 nodes: one tree,\none recorded direct defect",xy=(15,1),xytext=(10.8,28),
                    arrowprops={"arrowstyle":"-","color":"#8D9BA5"},fontsize=9,color="#526673",
                    bbox={"boxstyle":"round,pad=0.25","facecolor":"#F1F3F5","edgecolor":"none"})
        fig.text(.02,.05,"Sparse tail percentages depend on very few cases. This is a descriptive audit ladder, not a population error-rate model.",fontsize=9,color="#526673")
        save(fig,data/"prt-node-ladder")
