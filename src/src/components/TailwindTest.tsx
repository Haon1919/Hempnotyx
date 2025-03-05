import * as React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Tailwind CSS Test</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Theme Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary text-white rounded">Primary</div>
          <div className="p-4 bg-primary-dark text-white rounded">Primary Dark</div>
          <div className="p-4 bg-secondary text-white rounded">Secondary</div>
          <div className="p-4 bg-background border border-gray-200 rounded">Background</div>
          <div className="p-4 bg-error text-white rounded">Error</div>
          <div className="p-4 bg-success text-white rounded">Success</div>
          <div className="p-4 bg-warning text-white rounded">Warning</div>
          <div className="p-4 bg-white text-text-primary border border-gray-200 rounded">Text Primary</div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Responsive Design</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-4 bg-gray-100 rounded shadow">
              <p className="hidden sm:block md:hidden">Small screens</p>
              <p className="hidden md:block lg:hidden">Medium screens</p>
              <p className="hidden lg:block">Large screens</p>
              <p className="block sm:hidden">Mobile</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Component Classes</h2>
        <div className="space-y-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary ml-4">Secondary Button</button>
          <div className="form-group mt-4">
            <label className="form-label">Input Field</label>
            <input type="text" className="input" placeholder="Type here..." />
          </div>
          <div className="form-group">
            <label className="form-label">Input with Error</label>
            <input type="text" className="input input-error" placeholder="Error state" />
            <p className="form-error">This field is required</p>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Animation</h2>
        <div className="flex space-x-4">
          <div className="animate-pulse-green p-4 bg-primary text-white rounded">
            Custom animation: pulse-green
          </div>
          <div className="animate-pulse p-4 bg-blue-500 text-white rounded">
            Default animation: pulse
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Card Component</h2>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Card Title</h3>
          <p className="text-text-secondary mb-4">This is a card component styled with Tailwind CSS.</p>
          <button className="btn-primary">Action</button>
        </div>
      </section>
    </div>
  );
};

export default TailwindTest; 