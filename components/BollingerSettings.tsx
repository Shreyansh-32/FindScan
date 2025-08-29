"use client";
import { BollingerBandsOptions, BollingerBandStyleOptions } from "@/lib/indicator/bollinger";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dispatch, SetStateAction } from "react";

function StyleControl({
  label,
  options,
  onOptionsChange,
}: {
  label: string;
  options: BollingerBandStyleOptions;
  onOptionsChange: (newOptions: BollingerBandStyleOptions) => void;
}) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label className="text-sm">{label}</label>
      <Switch
        checked={options.visibility}
        onCheckedChange={(checked) => onOptionsChange({ ...options, visibility: checked })}
      />
      <Input
        type="color"
        value={options.color}
        onChange={(e) => onOptionsChange({ ...options, color: e.target.value })}
        className="p-1 h-8"
      />
      <Input
        type="number"
        min={1}
        max={10}
        value={options.lineWidth}
        onChange={(e) => onOptionsChange({ ...options, lineWidth: Number(e.target.value) })}
        className="h-8"
      />
    </div>
  );
}

export default function BollingerSettings({ options, setOptions }: { options: BollingerBandsOptions, setOptions: Dispatch<SetStateAction<BollingerBandsOptions>> }) {
  
  const handleInputChange = (field: 'length' | 'stdDev' | 'offset', value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setOptions(prev => ({ ...prev, inputs: { ...prev.inputs, [field]: numValue } }));
    }
  };

  const handleStyleChange = (band: 'basis' | 'upper' | 'lower', newStyle: BollingerBandStyleOptions) => {
    setOptions(prev => ({ ...prev, style: { ...prev.style, [band]: newStyle } }));
  };

  const handleBackgroundChange = (key: 'visibility' | 'opacity', value: boolean | number) => {
    setOptions(prev => ({
      ...prev,
      style: { ...prev.style, background: { ...prev.style.background, [key]: value } },
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black hover:scale-105">Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>Bollinger Bands Settings</DialogTitle></DialogHeader>
        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          <TabsContent value="inputs">
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="length" className="text-right">Length</label>
                  <Input id="length" type="number" value={options.inputs.length} onChange={(e) => handleInputChange('length', e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="stdDev" className="text-right">StdDev</label>
                  <Input id="stdDev" type="number" value={options.inputs.stdDev} onChange={(e) => handleInputChange('stdDev', e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="offset" className="text-right">Offset</label>
                  <Input id="offset" type="number" value={options.inputs.offset} onChange={(e) => handleInputChange('offset', e.target.value)} className="col-span-3" />
                </div>
              </div>
          </TabsContent>
          <TabsContent value="style">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <span className="text-sm font-medium">Band</span>
                <span className="text-sm font-medium">Visible</span>
                <span className="text-sm font-medium">Color</span>
                <span className="text-sm font-medium">Width</span>
              </div>
              <StyleControl label="Basis" options={options.style.basis} onOptionsChange={(newStyle) => handleStyleChange('basis', newStyle)} />
              <StyleControl label="Upper" options={options.style.upper} onOptionsChange={(newStyle) => handleStyleChange('upper', newStyle)} />
              <StyleControl label="Lower" options={options.style.lower} onOptionsChange={(newStyle) => handleStyleChange('lower', newStyle)} />

              <div className="border-t border-neutral-700 my-2"></div>

              <div className="grid grid-cols-4 items-center gap-4">
                 <label className="text-sm">Background</label>
                 <Switch
                    checked={options.style.background.visibility}
                    onCheckedChange={(checked) => handleBackgroundChange('visibility', checked)}
                  />
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-sm">Opacity</span>
                    <Slider
                      min={0} max={1} step={0.1}
                      value={[options.style.background.opacity]}
                      onValueChange={([value]) => handleBackgroundChange('opacity', value)}
                    />
                  </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}