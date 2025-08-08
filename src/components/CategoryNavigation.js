import React, { useState, useEffect } from 'react';
import { categories, categoryConfig } from '../graphData';
// import Icon from './Icon';
// import { HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import './CategoryNavigation.css';

function CategoryNavigation({ graphs, isDarkMode }) {
  const isCollapsed = false; // Collapse functionality disabled
  const [activeCategory, setActiveCategory] = useState(null);

  // Get categories that have charts
  const availableCategories = categories.filter(category => 
    graphs.some(graph => graph.category === category)
  );

  // Scroll to category when clicked
  const scrollToCategory = (category) => {
    const categoryElement = document.querySelector(`[data-category-section="${category}"]`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Track which category is currently in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const category = entry.target.getAttribute('data-category-section');
          setActiveCategory(category);
        }
      });
    }, observerOptions);

    // Handle scroll to detect when at bottom of page
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // If we're at the bottom of the page (within 50px), highlight the last category
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        const lastCategory = availableCategories[availableCategories.length - 1];
        if (lastCategory) {
          setActiveCategory(lastCategory);
        }
      }
    };

    // Observe all category sections
    availableCategories.forEach(category => {
      const element = document.querySelector(`[data-category-section="${category}"]`);
      if (element) {
        observer.observe(element);
      }
    });

    // Add scroll listener for bottom detection
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [availableCategories]);

  // const toggleCollapse = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  return (
    <div className={`category-navigation ${isCollapsed ? 'collapsed' : ''}`}>
      {/* <div className="category-nav-header">
        <button 
          className="category-nav-toggle"
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand categories' : 'Collapse categories'}
        >
          <Icon size="small">{isCollapsed ? <HiChevronRight /> : <HiChevronLeft />}</Icon>
        </button>
        {!isCollapsed && (
          <h3 className="category-nav-title">Categories</h3>
        )}
      </div> */}
      
      {!isCollapsed && (
        <nav className="category-nav-list">
          {availableCategories.map(category => {
            const config = categoryConfig[category] || { cssVar: "tradfi" };
            const chartCount = graphs.filter(graph => graph.category === category).length;
            
            return (
              <button
                key={category}
                className={`category-nav-item ${activeCategory === category ? 'active' : ''}`}
                onClick={() => scrollToCategory(category)}
                data-category={config.cssVar}
                title={`${chartCount} chart${chartCount !== 1 ? 's' : ''}`}
              >
                <span className="category-nav-name">{category}</span>
                <span className="category-nav-count">({chartCount})</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default CategoryNavigation;