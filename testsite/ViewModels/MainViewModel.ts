/// <reference path="../../Fayde.Drawing.d.ts" />
import Looper = require("../Looper");
import Clock = require("../Clock");

class MainViewModel extends Fayde.MVVM.ViewModelBase {

    private _Sketches: Fayde.IEventBindingArgs<Fayde.Drawing.SketchDrawEventArgs>[] = [];
    private _Looper: Looper;
    private _LondonClock: Clock;
    private _AucklandClock: Clock;

    constructor() {
        super();

        this._Looper = new Looper();

        this._Looper.Tick.Subscribe(() => {
            // invalidates all registered Sketch controls, causing them to repeatedly trigger their Draw event.
            for (var i = 0; i < this._Sketches.length; i++){
                var e: Fayde.IEventBindingArgs<Fayde.Drawing.SketchDrawEventArgs>  = this._Sketches[i];
                e.sender.Node.LayoutUpdater.InvalidateSubtreePaint();
            }
        }, this);

        this._Looper.Start();
    }

    LondonClock_Draw(e: Fayde.IEventBindingArgs<Fayde.Drawing.SketchDrawEventArgs>){
        if (!e.args.SketchSession.Registered) {
            e.args.SketchSession.Registered = true;
            this._Sketches.push(e);
            this._LondonClock = new Clock(e.args.SketchSession.Ctx, 0); // UTC
        }

        this._LondonClock.Draw();
    }

    AucklandClock_Draw(e: Fayde.IEventBindingArgs<Fayde.Drawing.SketchDrawEventArgs>){
        if (!e.args.SketchSession.Registered) {
            e.args.SketchSession.Registered = true;
            this._Sketches.push(e);
            this._AucklandClock = new Clock(e.args.SketchSession.Ctx, 11); // UTC + 11 hrs
        }

        this._AucklandClock.Draw();
    }

}
export = MainViewModel;